/**
 * ACURVION MARKETING — CLIENT-SIDE INTERACTIVE ENGINE
 * Official Brand: Acurvion Marketing
 * Tagline: We Turn Attention Into Growth.
 * Email: acurvion.marketing@gmail.com
 * Phone / WhatsApp: +91 88254 68608
 * Address: Avadi, Chennai, Tamil Nadu 600055, India
 */

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initScrollSpy();
    initServiceTabs();
    initPortfolioTabs();
    initFaqAccordion();
    initModals();
    initFeatureCards();
    initAboutAnimations();
    initScrollTop();
    initSmoothScroll();
    initEventTracking();
  });
}

// Fallback in case a Node.js serverless runtime attempts to execute this file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = (req, res) => {
    if (res && typeof res.writeHead === 'function') {
      res.writeHead(302, { Location: '/' });
      res.end();
    }
  };
}

/* ==========================================================================
   1. STICKY HEADER, SCROLL PROGRESS & ACTIVE STATES
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgressBar');
  if (!header) return;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      header.classList.add('home-scrolled');
    } else {
      header.classList.remove('home-scrolled');
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER, BACKDROP & MORPHING HAMBURGER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('homeNavToggle');
  const nav = document.getElementById('homeNav');
  const backdrop = document.getElementById('homeNavBackdrop');
  if (!toggleBtn || !nav) return;

  const closeMobileNav = () => {
    nav.classList.remove('open');
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openMobileNav = () => {
    nav.classList.add('open');
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileNav);
  }

  // Mobile dropdown toggle
  const dropdownToggles = document.querySelectorAll('.home-dd-toggle');
  dropdownToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const parent = btn.closest('.home-nav-item');
        if (parent) {
          const isItemOpen = parent.classList.toggle('open');
          btn.setAttribute('aria-expanded', isItemOpen);
        }
      }
    });
  });

  // Close nav when clicking a regular navigation link or mobile CTA
  nav.querySelectorAll('a:not(.home-dd-toggle), button[data-consult-trigger]').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeMobileNav();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMobileNav();
    }
  });
}

/* ==========================================================================
   3. SCROLLSPY (Highlighting active section link in header)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.home-nav .home-nav-link:not(.home-dd-toggle)');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   4. SERVICES CATEGORY TABS & SMOOTH FILTERING
   ========================================================================== */
function initServiceTabs() {
  const tabs = document.querySelectorAll('.home-service-tab');
  const cards = document.querySelectorAll('.home-service-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. PORTFOLIO & DEMONSTRATION PROJECTS CATEGORY TABS
   ========================================================================== */
function initPortfolioTabs() {
  const tabs = document.querySelectorAll('.home-portfolio-tab');
  const cards = document.querySelectorAll('.home-portfolio-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-portfolio-filter') || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. FAQ ACCORDION WITH FILTER PILLS & SMOOTH HEIGHT
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.home-faq-item');
  const pills = document.querySelectorAll('.home-faq-pill');

  faqItems.forEach(item => {
    const question = item.querySelector('.home-faq-question');
    const answer = item.querySelector('.home-faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.home-faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            const otherAns = other.querySelector('.home-faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = (answer.scrollHeight + 32) + 'px';
        }
      });
    }
  });

  // Category Filtering for FAQs
  if (pills.length) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const cat = pill.getAttribute('data-faq-cat') || 'all';

        faqItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (cat === 'all' || itemCat === cat) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease forwards';
          } else {
            item.style.display = 'none';
            item.classList.remove('open');
            const q = item.querySelector('.home-faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
            const a = item.querySelector('.home-faq-answer');
            if (a) a.style.maxHeight = null;
          }
        });
      });
    });
  }
}

/* ==========================================================================
   7. CONSULTATION & AUDIT MODAL WITH HUBSPOT CRM & VALIDATION
   ========================================================================== */
function initModals() {
  const modal = document.getElementById('consultModal');
  const triggers = document.querySelectorAll('[data-consult-trigger], [data-audit-trigger]');
  const closeBtn = document.getElementById('closeConsultModal');
  const form = document.getElementById('consultForm');
  const serviceSelect = document.getElementById('modalService');
  const formContainer = document.getElementById('modalFormContainer');
  const successContainer = document.getElementById('modalSuccessContainer');
  const modalTitle = document.getElementById('modalTitle');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalLead = document.getElementById('modalLead');

  if (!modal) return;

  let currentInquiryType = 'Growth Consultation';

  const openModal = (preselectedService = '', inquiryMode = 'consultation') => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Reset views: show form, hide success
    if (formContainer) formContainer.style.display = 'block';
    if (successContainer) {
      successContainer.style.display = 'none';
      successContainer.innerHTML = '';
    }

    if (inquiryMode === 'audit') {
      currentInquiryType = 'Free Website & SEO Audit';
      if (modalTitle) modalTitle.innerText = 'Request Your Free Website & Growth Audit';
      if (modalEyebrow) modalEyebrow.innerText = 'COMPREHENSIVE DIGITAL AUDIT';
      if (modalLead) modalLead.innerText = 'Receive a 360-degree audit of your website speed, search visibility, conversion bottlenecks, and competitor keyword gaps.';
    } else {
      currentInquiryType = 'Growth Consultation';
      if (modalTitle) modalTitle.innerText = 'Book Your Free Growth Consultation';
      if (modalEyebrow) modalEyebrow.innerText = 'FREE 30-MIN STRATEGY CALL';
      if (modalLead) modalLead.innerText = 'Speak directly with our senior growth strategist. No high-pressure sales — just actionable insights to scale your digital presence.';
    }

    if (serviceSelect && preselectedService) {
      serviceSelect.value = preselectedService;
    }

    // Set focus to first input
    const firstInput = document.getElementById('consultName');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const s = btn.getAttribute('data-service') || '';
      const isAudit = btn.hasAttribute('data-audit-trigger');
      openModal(s, isAudit ? 'audit' : 'consultation');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission & Validation with HubSpot Backend Sync
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('consultName');
      const companyEl = document.getElementById('consultCompany');
      const emailEl = document.getElementById('consultEmail');
      const phoneEl = document.getElementById('consultPhone');
      const websiteEl = document.getElementById('consultWebsite');
      const serviceEl = document.getElementById('modalService');
      const budgetEl = document.getElementById('consultBudget');
      const notesEl = document.getElementById('consultNotes');
      const consentEl = document.getElementById('consultConsent');
      const submitBtn = document.getElementById('consultSubmitBtn');

      const name = nameEl ? nameEl.value.trim() : '';
      const company = companyEl ? companyEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const website = websiteEl ? websiteEl.value.trim() : '';
      const service = serviceEl ? serviceEl.value : '';
      const budget = budgetEl ? budgetEl.value : '';
      const notes = notesEl ? notesEl.value.trim() : '';
      const consent = consentEl ? consentEl.checked : false;

      // Inline validation
      let hasError = false;

      const clearErrors = () => {
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
      };
      clearErrors();

      if (!name) {
        if (nameEl) nameEl.closest('.form-group').classList.add('has-error');
        hasError = true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (emailEl) emailEl.closest('.form-group').classList.add('has-error');
        hasError = true;
      }

      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      if (!cleanPhone || cleanPhone.length < 7) {
        if (phoneEl) phoneEl.closest('.form-group').classList.add('has-error');
        hasError = true;
      }

      if (!service) {
        if (serviceEl) serviceEl.closest('.form-group').classList.add('has-error');
        hasError = true;
      }

      if (!consent) {
        if (consentEl) consentEl.closest('.form-group').classList.add('has-error');
        hasError = true;
      }

      if (hasError) return;

      // Button loading state
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Submitting Inquiry...</span>`;
      }

      const leadPayload = {
        fullName: name,
        businessName: company,
        email: email,
        phone: phone,
        website: website,
        service: service,
        budget: budget,
        requirements: notes,
        consent: consent,
        inquiryType: currentInquiryType,
        sourceUrl: window.location.href
      };

      try {
        const response = await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Track Conversion Event
          trackConversionEvent('contact_form_submission', {
            service: service,
            budget: budget,
            inquiry_type: currentInquiryType,
            ref_id: result.refId
          });

          // Show authentic success view
          if (formContainer) formContainer.style.display = 'none';
          if (successContainer) {
            successContainer.style.display = 'block';
            successContainer.innerHTML = `
              <div style="text-align: center; padding: 20px 0;">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 14px rgba(46,125,50,0.2);">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style="font-size: 1.6rem; margin-bottom: 8px; color: var(--ink);">Inquiry Successfully Submitted!</h3>
                <p style="color: var(--muted); margin-bottom: 12px; font-size: 0.95rem;">
                  Reference ID: <strong style="color: var(--electric-blue);">${result.refId}</strong>.
                </p>
                <p style="color: var(--muted); margin-bottom: 24px; font-size: 0.9rem; line-height: 1.5;">
                  Your request has been registered with Acurvion Marketing. A senior strategist will review your business requirements and contact you within 24 business hours.
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                  <a href="${result.waUrl}" target="_blank" rel="noopener" class="home-btn home-btn-whatsapp">
                    <span>Connect on WhatsApp Now</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </a>
                  <button type="button" id="modalDoneBtn" class="home-btn home-btn-secondary">Close</button>
                </div>
              </div>
            `;

            const doneBtn = document.getElementById('modalDoneBtn');
            if (doneBtn) doneBtn.addEventListener('click', closeModal);
          }

          form.reset();
        } else {
          throw new Error(result.error || 'Server rejected submission');
        }

      } catch (err) {
        console.error('Lead submission network error:', err);

        // Fail-safe WhatsApp direct routing so lead is NEVER lost
        const fallbackRef = 'ACV-DIRECT-' + Math.floor(100000 + Math.random() * 900000);
        const fallbackWaText = encodeURIComponent(
          `*New Website ${currentInquiryType} — Ref: ${fallbackRef}*\n\n` +
          `• Name: ${name}\n` +
          (company ? `• Business: ${company}\n` : '') +
          `• Phone: ${phone}\n` +
          `• Email: ${email}\n` +
          (website ? `• Website: ${website}\n` : '') +
          `• Service: ${service}\n` +
          (budget ? `• Monthly Budget: ${budget}\n` : '') +
          `• Requirements: ${notes || 'Immediate consultation requested'}`
        );
        const fallbackWaUrl = `https://wa.me/918825468608?text=${fallbackWaText}`;

        if (formContainer) formContainer.style.display = 'none';
        if (successContainer) {
          successContainer.style.display = 'block';
          successContainer.innerHTML = `
            <div style="text-align: center; padding: 20px 0;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: #fff3cd; color: #856404; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 style="font-size: 1.45rem; margin-bottom: 8px; color: var(--ink);">Direct WhatsApp Routing Ready</h3>
              <p style="color: var(--muted); margin-bottom: 20px; font-size: 0.92rem;">
                To guarantee your message reaches our growth desk immediately without network delays, click below to open a pre-filled direct WhatsApp session.
              </p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="${fallbackWaUrl}" target="_blank" rel="noopener" class="home-btn home-btn-whatsapp">
                  <span>Send via WhatsApp (+91 88254 68608)</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                <button type="button" id="modalRetryBtn" class="home-btn home-btn-secondary">Edit Details</button>
              </div>
            </div>
          `;

          const retryBtn = document.getElementById('modalRetryBtn');
          if (retryBtn) {
            retryBtn.addEventListener('click', () => {
              if (formContainer) formContainer.style.display = 'block';
              if (successContainer) successContainer.style.display = 'none';
            });
          }
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
}

/* ==========================================================================
   8. FEATURE CARDS & CREDIBLE FRAMEWORK OBSERVER
   (Replaces fabricated statistics with elegant, smooth entrance transitions)
   ========================================================================== */
function initFeatureCards() {
  const cards = document.querySelectorAll('.home-metric-box, .home-pillar-box, .home-strategy-feature-item');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
}

/* ==========================================================================
   8b. ABOUT SECTION SCROLL ANIMATIONS
   Minimal fade-up entrance for narrative text, mission/vision cards and value cards
   ========================================================================== */
function initAboutAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    document.querySelectorAll('.home-about-narrative, .home-mv-card, .home-value-card')
      .forEach(el => el.classList.add('in-view'));
    return;
  }

  const targets = document.querySelectorAll(
    '.home-about-narrative, .home-mv-card, .home-value-card, .home-about-feat-card'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. SCROLL TO TOP FLOATING BUTTON
   ========================================================================== */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   10. SMOOTH SCROLLING FOR INTERNAL ANCHORS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || (targetId === '#contact' && this.hasAttribute('data-consult-trigger'))) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   11. CONVERSION EVENT TRACKING (GTM, GA4, Meta Pixel)
   ========================================================================== */
function trackConversionEvent(eventName, eventData = {}) {
  try {
    // 1. Google Tag Manager DataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString()
    });

    // 2. Google Analytics 4 gtag support if configured
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventData);
    }

    // 3. Meta Pixel fbq support if configured
    if (typeof window.fbq === 'function') {
      if (eventName === 'contact_form_submission') {
        window.fbq('track', 'Lead', eventData);
      } else if (eventName === 'consultation_booking_click') {
        window.fbq('track', 'Schedule', eventData);
      } else {
        window.fbq('trackCustom', eventName, eventData);
      }
    }

    // Diagnostic console trace (helpful during verification)
    console.log(`[Acurvion Tracking] Event: ${eventName}`, eventData);
  } catch (err) {
    console.warn('Tracking dispatch notice:', err);
  }
}

function initEventTracking() {
  // WhatsApp Clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      trackConversionEvent('whatsapp_click', {
        destination: link.getAttribute('href'),
        label: link.innerText.trim() || 'WhatsApp CTA'
      });
    });
  });

  // Phone Call Clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackConversionEvent('phone_call_click', {
        phone_number: link.getAttribute('href')
      });
    });
  });

  // Email Clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackConversionEvent('email_click', {
        email: link.getAttribute('href')
      });
    });
  });

  // Consultation Trigger Clicks
  document.querySelectorAll('[data-consult-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      trackConversionEvent('consultation_booking_click', {
        service_hint: btn.getAttribute('data-service') || 'general'
      });
    });
  });

  // Website Audit Trigger Clicks
  document.querySelectorAll('[data-audit-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      trackConversionEvent('website_audit_click', {
        page: window.location.pathname
      });
    });
  });

  // Track service page visit if on dedicated service page
  if (window.location.pathname.includes('/services/')) {
    trackConversionEvent('service_page_view', {
      page_path: window.location.pathname,
      page_title: document.title
    });
  }
}
