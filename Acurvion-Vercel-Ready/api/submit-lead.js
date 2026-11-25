/**
 * ACURVION MARKETING — SECURE LEAD INGESTION & HUBSPOT CRM CONNECTOR
 * Vercel Serverless Function: /api/submit-lead
 *
 * Captures website leads and securely forwards them to HubSpot CRM.
 * Secrets are accessed strictly server-side via process.env.HUBSPOT_ACCESS_TOKEN.
 * Zero API keys or tokens are ever exposed to the client browser.
 */

module.exports = async (req, res) => {
  // CORS & Preflight handling
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. This endpoint accepts POST requests only.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const {
      fullName = '',
      businessName = '',
      email = '',
      phone = '',
      website = '',
      service = '',
      budget = '',
      requirements = '',
      consent = false,
      inquiryType = 'Growth Consultation'
    } = body;

    // Server-side Validation
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const cleanPhone = trimmedPhone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      return res.status(400).json({ success: false, error: 'A valid phone number is required (min 7 digits).' });
    }

    if (!service) {
      return res.status(400).json({ success: false, error: 'Please select a required service.' });
    }

    if (!consent) {
      return res.status(400).json({ success: false, error: 'Privacy policy consent is required.' });
    }

    // Name splitting
    const nameParts = trimmedName.split(' ');
    const firstName = nameParts[0] || 'Prospect';
    const lastName = nameParts.slice(1).join(' ') || '';

    const submissionDate = new Date().toISOString();
    const refId = 'ACV-' + Date.now().toString(36).toUpperCase();
    const leadSource = 'Website - Acurvion Marketing';

    // ── Google Sheets Sync (via Apps Script Web App Webhook) ──────────────
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxtBwIj-wJm9Ym8fFctt9gc7Xw_DshNX-OycEcJ5_4Cy1AJCuYFa6D6x_S3uEvWRpO0tQ/exec';
    let sheetsSyncStatus = 'unconfigured';

    if (sheetsWebhookUrl) {
      try {
        const sheetsPayload = {
          refId,
          fullName: trimmedName,
          businessName: businessName.trim(),
          email: trimmedEmail,
          phone: trimmedPhone,
          website: website.trim(),
          service,
          budget,
          requirements: requirements.trim(),
          inquiryType,
          submissionDate
        };

        const sheetsRes = await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetsPayload),
          redirect: 'follow'   // Apps Script redirects on deploy
        });

        if (sheetsRes.ok) {
          sheetsSyncStatus = 'saved';
        } else {
          console.warn('Google Sheets webhook status:', sheetsRes.status);
          sheetsSyncStatus = 'error';
        }
      } catch (sheetsErr) {
        console.error('Google Sheets sync error:', sheetsErr);
        sheetsSyncStatus = 'exception';
      }
    }

    // HubSpot CRM Synchronization
    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
    let hubspotSyncStatus = 'unconfigured';
    let hubspotContactId = null;

    if (hubspotToken) {
      try {
        const hsContactPayload = {
          properties: {
            email: trimmedEmail,
            firstname: firstName,
            lastname: lastName,
            phone: trimmedPhone,
            company: businessName.trim() || undefined,
            website: website.trim() || undefined,
            hs_lead_status: 'NEW',
            lead_source: leadSource,
            service_interest: service,
            monthly_marketing_budget: budget || undefined,
            message: `[${inquiryType}] ${requirements.trim() || 'No additional notes provided'}`
          }
        };

        // Remove undefined properties
        Object.keys(hsContactPayload.properties).forEach(
          key => hsContactPayload.properties[key] === undefined && delete hsContactPayload.properties[key]
        );

        const hsResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hubspotToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(hsContactPayload)
        });

        const hsData = await hsResponse.json();

        if (hsResponse.ok) {
          hubspotSyncStatus = 'created';
          hubspotContactId = hsData.id;
        } else if (hsResponse.status === 409 && hsData.message) {
          // Contact already exists — extract existing ID and update
          const match = hsData.message.match(/Existing ID:\s*([0-9]+)/i);
          if (match && match[1]) {
            hubspotContactId = match[1];
            await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${hubspotContactId}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${hubspotToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(hsContactPayload)
            });
            hubspotSyncStatus = 'updated';
          } else {
            hubspotSyncStatus = 'existing';
          }
        } else {
          console.warn('HubSpot CRM API notice:', hsData);
          hubspotSyncStatus = 'error';
        }
      } catch (hsErr) {
        console.error('HubSpot sync exception:', hsErr);
        hubspotSyncStatus = 'exception';
      }
    }

    // Prepare direct WhatsApp bridge link for instant lead follow-up
    const waText = encodeURIComponent(
      `*New ${inquiryType} Inquiry — Ref: ${refId}*\n\n` +
      `• *Name:* ${trimmedName}\n` +
      (businessName ? `• *Business:* ${businessName.trim()}\n` : '') +
      `• *Phone:* ${trimmedPhone}\n` +
      `• *Email:* ${trimmedEmail}\n` +
      (website ? `• *Website:* ${website.trim()}\n` : '') +
      `• *Service:* ${service}\n` +
      (budget ? `• *Monthly Budget:* ${budget}\n` : '') +
      `• *Requirements:* ${requirements.trim() || 'Immediate strategy consultation requested'}\n\n` +
      `• *Source:* ${leadSource}\n` +
      `• *Status:* Confirmed on ${new Date().toLocaleDateString('en-IN')}`
    );

    const waUrl = `https://wa.me/918825468608?text=${waText}`;

    return res.status(200).json({
      success: true,
      refId,
      sheetsSyncStatus,
      hubspotSyncStatus,
      hubspotContactId,
      submissionDate,
      waUrl,
      message: hubspotToken
        ? 'Lead registered in HubSpot CRM and Google Sheet.'
        : sheetsWebhookUrl
          ? 'Lead saved to Google Sheet. Add HUBSPOT_ACCESS_TOKEN to also sync HubSpot CRM.'
          : 'Lead captured successfully! Add GOOGLE_SHEETS_WEBHOOK_URL and HUBSPOT_ACCESS_TOKEN in Vercel environment variables to enable sheet & CRM sync.'
    });

  } catch (error) {
    console.error('Lead submission failure:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred while processing your inquiry. Please contact us directly via WhatsApp at +91 88254 68608.'
    });
  }
};
