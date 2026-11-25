/**
 * ACURVION MARKETING — Google Sheets Lead Capture
 * ================================================
 * Deploy this as a Google Apps Script Web App to automatically
 * save every lead form submission to this Google Sheet.
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1A2Y6diIeKLhXKdggTChGQDEZubweKfS7wJeni7S1KYg
 * 2. Click Extensions → Apps Script
 * 3. Delete any existing code in the editor
 * 4. Paste this entire script
 * 5. Click Save (Ctrl+S)
 * 6. Click Deploy → New deployment
 * 7. Select type: Web App
 * 8. Set "Execute as": Me (your Google account)
 * 9. Set "Who has access": Anyone
 * 10. Click Deploy → Authorize → Allow
 * 11. Copy the Web App URL shown (looks like: https://script.google.com/macros/s/AKfyc.../exec)
 * 12. Add it as an environment variable in Vercel:
 *     Variable name:  GOOGLE_SHEETS_WEBHOOK_URL
 *     Variable value: (paste the URL from step 11)
 */

const SHEET_NAME = 'Leads'; // Will auto-create this sheet tab

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create sheet and headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        'Ref ID',
        'Date & Time (IST)',
        'Full Name',
        'Business Name',
        'Email',
        'Phone',
        'Website',
        'Service Required',
        'Monthly Budget',
        'Requirements / Notes',
        'Inquiry Type',
        'Lead Source'
      ];
      sheet.appendRow(headers);

      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#071A45');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, headers.length, 160);
      sheet.setColumnWidth(9, 220); // Requirements column wider
    }

    // Parse incoming JSON
    const data = JSON.parse(e.postData.contents);

    // Format IST timestamp
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const timestamp = Utilities.formatDate(istTime, 'UTC', 'dd-MM-yyyy HH:mm:ss') + ' IST';

    // Append the lead row
    sheet.appendRow([
      data.refId || '',
      timestamp,
      data.fullName || '',
      data.businessName || '',
      data.email || '',
      data.phone || '',
      data.website || '',
      data.service || '',
      data.budget || '',
      data.requirements || '',
      data.inquiryType || 'Growth Consultation',
      'Website — Acurvion Marketing'
    ]);

    // Alternate row shading for readability
    const lastRow = sheet.getLastRow();
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, 12).setBackground('#f0f4ff');
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test by visiting the web app URL in a browser (GET handler)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Acurvion Marketing — Lead Sheet Webhook Active ✓',
      sheet: SHEET_NAME,
      time: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
