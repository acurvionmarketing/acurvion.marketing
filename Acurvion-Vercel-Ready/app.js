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
  initServiceTabs();
  initFaqAccordion();
  initModals();
  initSmoothScroll();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('home-scrolled');
    } else {
      header.classList.remove('home-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER & DROPDOWNS
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('homeNavToggle');
  const nav = document.getElementById('homeNav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Mobile dropdown toggle
  const dropdownToggles = document.querySelectorAll('.home-dd-toggle');
  dropdownToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const parent = btn.closest('.home-nav-item');
        if (parent) {
          parent.classList.toggle('open');
        }
      }
    });
  });

  // Close nav when clicking a regular link
  nav.querySelectorAll('a:not(.home-dd-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        nav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ==========================================================================
   3. SERVICES CATEGORY TABS
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
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. FAQ ACCORDION WITH FILTER PILLS
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
            const otherAns = other.querySelector('.home-faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
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
          } else {
            item.style.display = 'none';
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

  if (!modal) return;

  const openModal = (preselectedService = '') => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (serviceSelect && preselectedService) {
      serviceSelect.value = preselectedService;
    }
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

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('consultName').value.trim();
      const phone = document.getElementById('consultPhone').value.trim();
      const email = document.getElementById('consultEmail').value.trim();
      const service = document.getElementById('modalService').value;
      const notes = document.getElementById('consultNotes').value.trim();

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

      // Open WhatsApp directly for instant response
      const waUrl = `https://wa.me/918825468608?text=${waText}`;
      
      // Show confirmation dialog
      const dialog = modal.querySelector('.modal-dialog');
      if (dialog) {
        dialog.innerHTML = `
          <button class="modal-close-btn" onclick="document.getElementById('consultModal').classList.remove('open'); document.body.style.overflow='';" aria-label="Close modal">&times;</button>
          <div style="text-align: center; padding: 24px 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Inquiry Received!</h3>
            <p style="color: var(--muted); margin-bottom: 20px;">Reference ID: <strong>${refId}</strong>. Our lead growth strategist is ready to review your goals.</p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="${waUrl}" target="_blank" rel="noopener" class="home-btn home-btn-whatsapp">
                Confirm Immediately on WhatsApp
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
              <button class="home-btn home-btn-secondary" onclick="document.getElementById('consultModal').classList.remove('open'); document.body.style.overflow='';">Done</button>
            </div>
          </div>
        `;
      }

      window.open(waUrl, '_blank');
    });
  }
}

/* ==========================================================================
   7. SMOOTH SCROLLING FOR INTERNAL ANCHORS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#contact') return; // Handled by modal trigger or default

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
