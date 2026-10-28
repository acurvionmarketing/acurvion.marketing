/**
 * ACURVION MARKETING AGENCY — CLIENT-SIDE INTERACTIVE ENGINE
 * Brand: Acurvion Marketing Agency
 * Tagline: We Turn Attention Into Growth.
 * Phone / WhatsApp: +91 88254 68608
 * Address: Avadi, Chennai, Tamil Nadu 600055, India
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollSpy();
  initServiceTabs();
  initFaqAccordion();
  initModals();
  initCounters();
  initScrollTop();
  initSmoothScroll();
});

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
   5. FAQ ACCORDION WITH FILTER PILLS & SMOOTH HEIGHT
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
          // Add extra buffer for comfortable internal padding
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
   6. CONSULTATION BOOKING & CONTACT MODALS
   ========================================================================== */
function initModals() {
  const modal = document.getElementById('consultModal');
  const triggers = document.querySelectorAll('[data-consult-trigger]');
  const closeBtn = document.getElementById('closeConsultModal');
  const form = document.getElementById('consultForm');
  const serviceSelect = document.getElementById('modalService');
  const formContainer = document.getElementById('modalFormContainer');
  const successContainer = document.getElementById('modalSuccessContainer');

  if (!modal) return;

  const openModal = (preselectedService = '') => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Reset views: show form, hide success
    if (formContainer) formContainer.style.display = 'block';
    if (successContainer) {
      successContainer.style.display = 'none';
      successContainer.innerHTML = '';
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
      openModal(s);
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

  // Handle Form Submission & Validation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('consultName');
      const phoneEl = document.getElementById('consultPhone');
      const emailEl = document.getElementById('consultEmail');
      const serviceEl = document.getElementById('modalService');
      const notesEl = document.getElementById('consultNotes');
      const submitBtn = document.getElementById('consultSubmitBtn');

      const name = nameEl ? nameEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const service = serviceEl ? serviceEl.value : '';
      const notes = notesEl ? notesEl.value.trim() : '';

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

      const phoneRegex = /[0-9]{7,15}/;
      if (!phone || !phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
        if (phoneEl) phoneEl.closest('.form-group').classList.add('has-error');
        hasError = true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (emailEl) emailEl.closest('.form-group').classList.add('has-error');
        hasError = true;
      }

      if (hasError) return;

      const refId = 'ACV-' + Math.floor(100000 + Math.random() * 900000);

      const waText = encodeURIComponent(
        `*New Website Growth Inquiry — Ref: ${refId}*\n\n` +
        `• Name: ${name}\n` +
        `• Phone/WhatsApp: ${phone}\n` +
        `• Business Email: ${email}\n` +
        `• Service Interest: ${service}\n` +
        `• Project Requirements: ${notes || 'Immediate consultation requested'}\n\n` +
        `Please confirm available consultation slots.`
      );

      const waUrl = `https://wa.me/918825468608?text=${waText}`;

      // Loading state on button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Connecting to Strategist...</span>`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Reserve Strategy Session</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>`;
        }

        // Switch to success view without destroying original form!
        if (formContainer) formContainer.style.display = 'none';
        if (successContainer) {
          successContainer.style.display = 'block';
          successContainer.innerHTML = `
            <div style="text-align: center; padding: 18px 0;">
              <div style="width: 60px; height: 60px; border-radius: 50%; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 14px rgba(46,125,50,0.2);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style="font-size: 1.55rem; margin-bottom: 8px; color: var(--ink);">Inquiry Received!</h3>
              <p style="color: var(--muted); margin-bottom: 22px; font-size: 0.95rem;">Reference ID: <strong>${refId}</strong>. Your consultation request has been forwarded to our lead growth team.</p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="${waUrl}" target="_blank" rel="noopener" class="home-btn home-btn-whatsapp">
                  Open Direct WhatsApp Chat
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                <button type="button" id="modalDoneBtn" class="home-btn home-btn-secondary">Done</button>
              </div>
            </div>
          `;

          const doneBtn = document.getElementById('modalDoneBtn');
          if (doneBtn) doneBtn.addEventListener('click', closeModal);
        }

        form.reset();
        window.open(waUrl, '_blank');
      }, 500);
    });
  }
}

/* ==========================================================================
   7. INTERACTIVE METRIC COUNTERS
   ========================================================================== */
function initCounters() {
  const metricElements = document.querySelectorAll('.home-metric-val, .home-strategy-lead-num');
  if (!metricElements.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateMetric(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  metricElements.forEach(el => observer.observe(el));

  function animateMetric(el) {
    const text = el.innerText.trim();
    if (text.includes('+320%')) {
      countUp(el, 0, 320, 1400, '+', '%');
    } else if (text.includes('4.8x')) {
      countDecimal(el, 1.0, 4.8, 1400, '', 'x');
    } else if (text.includes('98%')) {
      countUp(el, 50, 98, 1200, '', '%');
    }
  }

  function countUp(el, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(start + (end - start) * ease);
      el.innerText = `${prefix}${val}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerText = `${prefix}${end}${suffix}`;
      }
    };
    requestAnimationFrame(step);
  }

  function countDecimal(el, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = (start + (end - start) * ease).toFixed(1);
      el.innerText = `${prefix}${val}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerText = `${prefix}${end}${suffix}`;
      }
    };
    requestAnimationFrame(step);
  }
}

/* ==========================================================================
   8. SCROLL TO TOP FLOATING BUTTON
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
   9. SMOOTH SCROLLING FOR INTERNAL ANCHORS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#contact' && this.hasAttribute('data-consult-trigger')) return;

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
