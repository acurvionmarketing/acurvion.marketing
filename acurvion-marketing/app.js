/**
 * ACURVION MARKETING AGENCY - INTERACTIVE ENGINE
 * Brand: Acurvion Marketing Agency
 * Tagline: We Turn Attention Into Growth.
 * Phone / WhatsApp: +91 88254 68608
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initFunnelVisual();
  initServiceButtons();
  initEstimatorTool();
  initPortfolioFilters();
  initFaqAccordion();
  initContactForm();
  initBookingModal();
  initLegalModals();
  initCookieBanner();
  initConversionTracking();
});

/* ==========================================================================
   1. Theme Toggle (Obsidian Navy Dark Mode <-> Crisp Clean Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlEl = document.documentElement;
  
  // Retrieve saved theme or prefer dark
  const savedTheme = localStorage.getItem('acurvion_theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('acurvion_theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Sticky Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('header-scrolled');
    } else {
      siteHeader.classList.remove('header-scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Mobile drawer toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // ScrollSpy active link
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   3. Kinetic Growth Visual Interactivity
   ========================================================================== */
function initFunnelVisual() {
  const funnelStages = document.querySelectorAll('.funnel-stage');
  const statVal1 = document.getElementById('funnelStatVal1');
  const statVal2 = document.getElementById('funnelStatVal2');
  const statDesc = document.getElementById('funnelStatDesc');

  const stageData = {
    'attention': {
      title: 'Attention & Brand Resonance',
      stat1: 'High-Intent Reach',
      stat2: 'Multi-Touch Discovery',
      desc: 'Capturing qualified interest through organic search visibility and targeted paid media.'
    },
    'visibility': {
      title: 'Market Authority & Trust',
      stat1: 'Category Presence',
      stat2: 'Search Engine Authority',
      desc: 'Positioning your business where serious buyers evaluate solutions.'
    },
    'leads': {
      title: 'Conversion & Qualified Inquiries',
      stat1: 'High Lead Quality',
      stat2: 'Conversion Friction Removed',
      desc: 'Transforming visitors into verified leads, scheduled consultations, and WhatsApp inquiries.'
    },
    'growth': {
      title: 'Measurable Revenue Expansion',
      stat1: 'Compounding Value',
      stat2: 'Sustainable Client Flow',
      desc: 'Generating scalable, predictable commercial return from continuous campaign optimization.'
    }
  };

  funnelStages.forEach(stage => {
    stage.addEventListener('click', () => {
      funnelStages.forEach(s => s.classList.remove('active'));
      stage.classList.add('active');

      const stageKey = stage.getAttribute('data-stage');
      const data = stageData[stageKey];
      if (data && statVal1 && statVal2 && statDesc) {
        statVal1.textContent = data.stat1;
        statVal2.textContent = data.stat2;
        statDesc.textContent = data.desc;
      }
    });
  });
}

/* ==========================================================================
   4. Service CTAs with Dynamic Form Preselection
   ========================================================================== */
function initServiceButtons() {
  const serviceButtons = document.querySelectorAll('.service-cta-btn');
  const serviceSelect = document.getElementById('contactService');
  const contactSection = document.getElementById('contact');

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetService = btn.getAttribute('data-service');
      if (targetService && serviceSelect) {
        serviceSelect.value = targetService;
        
        // Highlight field briefly
        serviceSelect.style.borderColor = '#1769FF';
        serviceSelect.style.boxShadow = '0 0 0 3px rgba(23, 105, 255, 0.3)';
        setTimeout(() => {
          serviceSelect.style.borderColor = '';
          serviceSelect.style.boxShadow = '';
        }, 1500);
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Growth Estimator Tool
   ========================================================================== */
function initEstimatorTool() {
  const estimatorForm = document.getElementById('estimatorForm');
  const blueprintTitle = document.getElementById('blueprintTitle');
  const blueprintSummary = document.getElementById('blueprintSummary');
  const blueprintChannels = document.getElementById('blueprintChannels');
  const blueprintPacing = document.getElementById('blueprintPacing');
  const estimatorSendBtn = document.getElementById('estimatorSendBtn');

  if (!estimatorForm) return;

  estimatorForm.addEventListener('change', updateBlueprint);
  
  function updateBlueprint() {
    const industry = document.getElementById('estIndustry').value;
    const primaryGoal = document.getElementById('estGoal').value;
    const timeline = document.getElementById('estTimeline').value;
    
    // Checked channels
    const checked = Array.from(document.querySelectorAll('input[name="estChannels"]:checked')).map(cb => cb.value);
    
    let title = `${industry} Growth Architecture`;
    let summary = '';
    let pacing = '';

    if (primaryGoal === 'leads') {
      summary = `A direct response and conversion infrastructure tailored for ${industry}. Combines targeted high-intent acquisition with conversion-optimized landing pages to accelerate qualified inquiries.`;
    } else if (primaryGoal === 'seo') {
      summary = `A compounding organic search roadmap targeting commercial intent keywords and local authority signals to capture organic prospects actively seeking ${industry} services.`;
    } else if (primaryGoal === 'brand') {
      summary = `A unified brand identity and authority campaign across social, web, and creative touchpoints to build category distinction and premium perception in ${industry}.`;
    } else {
      summary = `A balanced full-funnel digital strategy synchronizing top-of-funnel reach, mid-funnel nurture, and bottom-of-funnel lead generation for ${industry}.`;
    }

    if (timeline === 'fast') {
      pacing = 'Accelerated Launch (Weeks 1-4) with continuous optimization sprints';
    } else if (timeline === 'quarterly') {
      pacing = 'Structured 90-Day Foundation & Compounding Phase';
    } else {
      pacing = 'Long-Term Sustainable Scale & Search Authority Track';
    }

    if (blueprintTitle) blueprintTitle.textContent = title;
    if (blueprintSummary) blueprintSummary.textContent = summary;
    if (blueprintChannels) {
      blueprintChannels.textContent = checked.length > 0 ? checked.join(' • ') : 'Full-Funnel Suite';
    }
    if (blueprintPacing) blueprintPacing.textContent = pacing;
  }

  // Pre-fill blueprint to contact form or WhatsApp
  if (estimatorSendBtn) {
    estimatorSendBtn.addEventListener('click', () => {
      const industry = document.getElementById('estIndustry').value;
      const primaryGoal = document.getElementById('estGoal').value;
      const checked = Array.from(document.querySelectorAll('input[name="estChannels"]:checked')).map(cb => cb.value).join(', ');
      
      const detailsField = document.getElementById('contactDetails');
      const serviceSelect = document.getElementById('contactService');
      
      if (detailsField) {
        detailsField.value = `[Generated Blueprint Inquiry]\nIndustry: ${industry}\nPrimary Goal: ${primaryGoal}\nKey Focus Channels: ${checked}\n\nPlease prepare a strategic proposal based on this configuration.`;
      }

      if (serviceSelect) {
        if (primaryGoal === 'seo') serviceSelect.value = 'SEO';
        else if (primaryGoal === 'leads') serviceSelect.value = 'PPC';
        else if (primaryGoal === 'brand') serviceSelect.value = 'Branding';
        else serviceSelect.value = 'Full-Funnel Growth';
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   6. Portfolio / Strategy Blueprint Filters
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Frequently Asked Questions (FAQ) Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Optional: close siblings
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.faq-question-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

/* ==========================================================================
   8. Lead Generation Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('acurvionContactForm');
  const formCard = document.getElementById('contactFormCard');
  const successCard = document.getElementById('formSuccessCard');
  const referenceIdSpan = document.getElementById('leadReferenceId');
  const whatsappTransferBtn = document.getElementById('whatsappTransferBtn');
  const submitBtn = document.getElementById('submitContactBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot
    const hpField = document.getElementById('formHpField');
    if (hpField && hpField.value.trim() !== '') {
      console.warn('Spam submission suppressed.');
      return;
    }

    let isValid = true;

    // Fields
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const companyInput = document.getElementById('contactCompany');
    const websiteInput = document.getElementById('contactWebsite');
    const serviceSelect = document.getElementById('contactService');
    const budgetSelect = document.getElementById('contactBudget');
    const detailsInput = document.getElementById('contactDetails');

    // Name validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput, 'Please provide your full name (minimum 2 characters).');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please provide a valid business email address.');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Company validation
    if (!companyInput.value.trim() || companyInput.value.trim().length < 2) {
      setFieldError(companyInput, 'Please enter your company or business name.');
      isValid = false;
    } else {
      clearFieldError(companyInput);
    }

    // Service validation
    if (!serviceSelect.value) {
      setFieldError(serviceSelect, 'Please select the primary marketing service required.');
      isValid = false;
    } else {
      clearFieldError(serviceSelect);
    }

    // Details validation
    if (!detailsInput.value.trim() || detailsInput.value.trim().length < 10) {
      setFieldError(detailsInput, 'Please provide brief details about your project or goals (at least 10 characters).');
      isValid = false;
    } else {
      clearFieldError(detailsInput);
    }

    if (!isValid) return;

    // Build payload
    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      company: companyInput.value.trim(),
      website: websiteInput ? websiteInput.value.trim() : '',
      service: serviceSelect.value,
      budget: budgetSelect ? budgetSelect.value : 'Not specified',
      details: detailsInput.value.trim()
    };

    // Button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Transmitting Inquiry...</span>`;

    let generatedReference = 'ACV-' + Date.now().toString(36).toUpperCase();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.referenceId) {
          generatedReference = result.referenceId;
        }
      } else {
        throw new Error('API server returned error status ' + response.status);
      }
    } catch (err) {
      console.warn('API call fallback to local storage:', err);
      // Backup to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('acurvion_local_leads') || '[]');
        stored.push({ id: generatedReference, ...payload, date: new Date().toISOString() });
        localStorage.setItem('acurvion_local_leads', JSON.stringify(stored));
      } catch (storageErr) {
        console.error('LocalStorage write error:', storageErr);
      }
    }

    // Trigger conversion event
    if (window.acurvionTrackEvent) {
      window.acurvionTrackEvent('lead_form_submitted', { service: payload.service, company: payload.company });
    }

    // Display Thank You state
    form.style.display = 'none';
    if (successCard) {
      successCard.style.display = 'block';
      if (referenceIdSpan) {
        referenceIdSpan.textContent = `Inquiry Reference: ${generatedReference}`;
      }

      // Configure direct WhatsApp forwarding button
      if (whatsappTransferBtn) {
        const prefilledText = encodeURIComponent(
          `Hello Acurvion, I have submitted an inquiry on your website.\n\n` +
          `Reference ID: ${generatedReference}\n` +
          `Name: ${payload.name}\n` +
          `Company: ${payload.company}\n` +
          `Service: ${payload.service}\n` +
          `Details: ${payload.details}`
        );
        whatsappTransferBtn.href = `https://wa.me/918825468608?text=${prefilledText}`;
      }
    }
  });

  function setFieldError(field, message) {
    const parent = field.closest('.form-field');
    if (parent) {
      parent.classList.add('has-error');
      const errorMsgEl = parent.querySelector('.form-error-msg');
      if (errorMsgEl) errorMsgEl.textContent = message;
    }
  }

  function clearFieldError(field) {
    const parent = field.closest('.form-field');
    if (parent) {
      parent.classList.remove('has-error');
    }
  }
}

/* ==========================================================================
   9. Discovery Call Booking Modal
   ========================================================================== */
function initBookingModal() {
  const openButtons = document.querySelectorAll('.open-booking-modal-btn');
  const modalOverlay = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeBookingModalBtn');
  const bookingForm = document.getElementById('bookingScheduleForm');
  const dateInput = document.getElementById('bookingDate');
  const slotButtons = document.querySelectorAll('.slot-btn');
  let selectedSlot = '10:00 AM IST';

  if (!modalOverlay) return;

  // Set minimum date to tomorrow
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateStr = tomorrow.toISOString().split('T')[0];
    dateInput.min = minDateStr;
    dateInput.value = minDateStr;
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Slot buttons selection
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.getAttribute('data-slot') || btn.textContent.trim();
    });
  });

  // Booking form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName').value.trim();
      const email = document.getElementById('bookEmail').value.trim();
      const topic = document.getElementById('bookTopic').value;
      const date = dateInput ? dateInput.value : 'Upcoming Business Day';

      if (!name || !email) {
        alert('Please provide your name and email to reserve your call.');
        return;
      }

      const bookingRef = 'CALL-' + Date.now().toString(36).toUpperCase();
      const payload = { name, email, topic, date, slot: selectedSlot, id: bookingRef };

      try {
        await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Booking API fallback to client log');
      }

      if (window.acurvionTrackEvent) {
        window.acurvionTrackEvent('discovery_call_booked', { date, slot: selectedSlot });
      }

      // Show instant confirmation
      const modalBody = modalOverlay.querySelector('.modal-dialog');
      if (modalBody) {
        modalBody.innerHTML = `
          <button class="modal-close-btn" onclick="document.getElementById('bookingModal').classList.remove('open'); document.body.style.overflow='';" aria-label="Close modal">&times;</button>
          <div style="text-align: center; padding: 20px 0;">
            <div class="success-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Discovery Call Reserved</h3>
            <p style="color: var(--text-secondary); margin-bottom: 18px;">Your 30-minute growth consultation with Acurvion has been scheduled for <strong>${date} at ${selectedSlot}</strong>.</p>
            <div class="success-reference-box">Confirmation ID: ${bookingRef}</div>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
              <a href="https://wa.me/918825468608?text=${encodeURIComponent(`Hello Acurvion, I just reserved a Discovery Call for ${date} at ${selectedSlot}. Booking ID: ${bookingRef}`)}" class="btn btn-whatsapp" target="_blank" rel="noopener">
                <span>Confirm on WhatsApp</span>
              </a>
              <button class="btn btn-secondary" onclick="document.getElementById('bookingModal').classList.remove('open'); document.body.style.overflow='';">Done</button>
            </div>
          </div>
        `;
      }
    });
  }
}

/* ==========================================================================
   10. Legal Modals (Privacy Policy & Terms)
   ========================================================================== */
function initLegalModals() {
  const privacyLinks = document.querySelectorAll('.open-privacy-modal');
  const termsLinks = document.querySelectorAll('.open-terms-modal');
  const legalModal = document.getElementById('legalModal');
  const legalTitle = document.getElementById('legalModalTitle');
  const legalBody = document.getElementById('legalModalBody');
  const closeBtn = document.getElementById('closeLegalModalBtn');

  if (!legalModal) return;

  privacyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPrivacyContent();
    });
  });

  termsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showTermsContent();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      legalModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  legalModal.addEventListener('click', (e) => {
    if (e.target === legalModal) {
      legalModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  function showPrivacyContent() {
    legalTitle.textContent = 'Privacy Policy';
    legalBody.innerHTML = `
      <p style="margin-bottom: 12px;"><strong>Effective Date:</strong> January 2026</p>
      <p style="margin-bottom: 14px;">Acurvion Marketing Agency ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, handle, and safeguard data submitted through our website and digital channels.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">1. Information We Collect</h4>
      <p style="margin-bottom: 14px;">We collect information that you voluntarily provide when requesting a consultation, booking a discovery call, or contacting us via WhatsApp. This may include your name, business email address, company name, website URL, and project notes.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">2. How We Use Your Information</h4>
      <p style="margin-bottom: 14px;">Your information is used strictly to respond to your inquiries, prepare custom marketing proposals, coordinate discovery calls, and deliver marketing services. We do not sell, rent, or distribute your contact details to third-party data brokers.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">3. Data Protection & Security</h4>
      <p style="margin-bottom: 14px;">We implement secure transmission protocols and restrict access to client inquiries to authorized agency personnel only.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">4. Contacting Us</h4>
      <p>For questions regarding your data or this policy, please reach out to us at <strong>+91 88254 68608</strong> or visit our office at 7th Cross Street, 4th Street, Brindavan Nagar, Avadi, Tamil Nadu 600055, India.</p>
    `;
    legalModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function showTermsContent() {
    legalTitle.textContent = 'Terms and Conditions';
    legalBody.innerHTML = `
      <p style="margin-bottom: 12px;"><strong>Effective Date:</strong> January 2026</p>
      <p style="margin-bottom: 14px;">Welcome to the official website of Acurvion Marketing Agency. By accessing our website, booking consultations, or reviewing our materials, you agree to these Terms and Conditions.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">1. Scope of Marketing Services</h4>
      <p style="margin-bottom: 14px;">Acurvion Marketing Agency provides professional digital marketing services including SEO, PPC management, social media marketing, content creation, branding, and web development. Specific deliverables, pricing, timelines, and scope are defined in customized client agreements.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">2. Realistic Marketing Standards</h4>
      <p style="margin-bottom: 14px;">We uphold transparent and realistic marketing practices. We do not promise guaranteed #1 search engine rankings, guaranteed sales volumes, or unrealistic instant outcomes, as digital performance is subject to search algorithm updates, market competition, budget, and audience response.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">3. Intellectual Property</h4>
      <p style="margin-bottom: 14px;">The Acurvion name, logo, graphic marks, website content, and original frameworks are the exclusive property of Acurvion Marketing Agency.</p>
      <h4 style="margin: 16px 0 8px 0; color: var(--color-electric);">4. Governing Law</h4>
      <p>These terms shall be governed in accordance with the laws of Tamil Nadu, India.</p>
    `;
    legalModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

/* ==========================================================================
   11. Cookie Consent Banner
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookiesBtn');
  const declineBtn = document.getElementById('declineCookiesBtn');

  if (!banner) return;

  const cookieChoice = localStorage.getItem('acurvion_cookie_consent');
  if (!cookieChoice) {
    banner.classList.add('open');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('acurvion_cookie_consent', 'accepted');
      banner.classList.remove('open');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('acurvion_cookie_consent', 'essential_only');
      banner.classList.remove('open');
    });
  }
}

/* ==========================================================================
   12. Analytics & Conversion Event Tracking
   ========================================================================== */
function initConversionTracking() {
  window.acurvionAnalytics = [];

  window.acurvionTrackEvent = function(eventName, eventParams = {}) {
    const eventRecord = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...eventParams
    };
    window.acurvionAnalytics.push(eventRecord);
    console.log('[Acurvion Analytics]', eventRecord);
  };

  // Track phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      window.acurvionTrackEvent('click_to_call', { phone: link.getAttribute('href') });
    });
  });

  // Track WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      window.acurvionTrackEvent('click_to_whatsapp', { destination: link.getAttribute('href') });
    });
  });
}
