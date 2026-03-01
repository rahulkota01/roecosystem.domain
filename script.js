/* ============================================================
   RO Ecosystem — Premium JS Engine
   Animations · Interactions · Effects
   roecosystem.in · 2026
   ============================================================ */

(function () {
  'use strict';

  /* ── Feature Detection ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====================================================
     0. THEME TOGGLE (Dark/Light Mode)
  ==================================================== */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check saved theme
    const savedTheme = localStorage.getItem('ro-theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('ro-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('ro-theme', 'light');
      }
    });
  }

  /* ====================================================
     1. SCROLL PROGRESS BAR
  ==================================================== */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ====================================================
     2. STICKY HEADER
  ==================================================== */
  const header = document.getElementById('site-header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ====================================================
     3. SMOOTH SCROLL (data-scroll)
  ==================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('[data-scroll]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const id = el.getAttribute('data-scroll');
        const target = document.getElementById(id);
        if (target) {
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // Close nav if open
        navMenu && navMenu.classList.remove('open');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ====================================================
     4. MOBILE NAV TOGGLE
  ==================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  function initMobileNav() {
    if (!navToggle || !navMenu) return;
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ====================================================
     5. DATA-HREF NAVIGATION
  ==================================================== */
  function initDataHref() {
    document.querySelectorAll('[data-href]').forEach(el => {
      // Skip elements that already have their own click handler (buttons inside cards)
      if (el.tagName === 'BUTTON' || (el.tagName === 'A' && el.hasAttribute('href'))) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const href = el.getAttribute('data-href');
        if (href) window.location.href = href;
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const href = el.getAttribute('data-href');
          if (href) window.location.href = href;
        }
      });
    });

    // Buttons with data-href
    document.querySelectorAll('button[data-href]').forEach(btn => {
      btn.addEventListener('click', () => {
        const href = btn.getAttribute('data-href');
        if (href) window.location.href = href;
      });
    });
  }

  /* ====================================================
     6. INTERSECTION OBSERVER — REVEAL ANIMATIONS
  ==================================================== */
  function initReveal() {
    const items = document.querySelectorAll('.reveal, .stagger-children');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Small delay to let layout settle
        requestAnimationFrame(() => {
          el.classList.add('visible');
        });
        io.unobserve(el);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    items.forEach(el => io.observe(el));
  }

  /* ====================================================
     7. COUNT-UP ANIMATION
  ==================================================== */
  function animateCountUp(el, target, duration) {
    if (prefersReducedMotion) { el.textContent = target; return; }
    const start = performance.now();
    const startVal = 0;
    const diff = target - startVal;

    function step(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + diff * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCountUp() {
    const counters = document.querySelectorAll('[data-count-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count-target'), 10);
        if (!isNaN(target)) animateCountUp(el, target, 1600);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));
  }

  /* ====================================================
     8. 3D CARD TILT ON HOVER
  ==================================================== */
  function initCardTilt() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.tilt-card').forEach(card => {
      let raf = null;

      card.addEventListener('mousemove', e => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          const rotX = -dy * 5;
          const rotY = dx * 5;
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
          card.style.transition = 'transform 0.1s linear';
        });
      });

      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
    });
  }

  /* ====================================================
     9. MAGNETIC BUTTON EFFECT
  ==================================================== */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
      let raf = null;

      btn.addEventListener('mousemove', e => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.2;
          const dy = (e.clientY - cy) * 0.2;
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });

      btn.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s linear, box-shadow 0.3s ease, background 0.2s ease';
      });
    });
  }

  /* ====================================================
     10. TEXT SCRAMBLE EFFECT (Hero Title)
  ==================================================== */
  const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#@&$%';

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = GLITCH_CHARS;
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      return new Promise(resolve => {
        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || '';
          const to = newText[i] || '';
          const start = Math.floor(Math.random() * 16);
          const end = start + Math.floor(Math.random() * 16);
          this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameReq);
        this.frame = 0;
        this.resolve = resolve;
        this.update();
      });
    }

    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span style="color:var(--cyan);opacity:0.7">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameReq = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  function initTextScramble() {
    // Disabled — glitch scramble is too playful for a research portal aesthetic.
    return;
  }

  /* ====================================================
     11. CURSOR PARTICLE TRAIL
  ==================================================== */
  function initCursorTrail() {
    if (prefersReducedMotion) return;
    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -200, y: -200 };
    let animId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Spawn particles
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 12,
          y: mouse.y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.5,
          life: 1,
          decay: 0.03 + Math.random() * 0.03,
          size: 2 + Math.random() * 3,
          hue: Math.random() > 0.5 ? 185 : 270, // cyan or violet
        });
      }
    }, { passive: true });

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue}, 100%, 65%)`;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(loop);
    }
    loop();
  }

  /* ====================================================
     12. PARALLAX on HERO ORBS
  ==================================================== */
  function initParallax() {
    if (prefersReducedMotion) return;
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          orbs.forEach((orb, i) => {
            const speed = 0.1 + i * 0.06;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ====================================================
     13. EMAILJS CONTACT FORM
  ==================================================== */
  function initEmailJS() {
    try {
      if (window.emailjs) {
        emailjs.init('1cx0_XtU9AgB7psEL');
      }
    } catch (e) {
      console.warn('EmailJS init failed', e);
    }

    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.getElementById('contact-submit');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name = form.from_name.value.trim();
      const email = form.from_email.value.trim();
      const msg = form.message.value.trim();
      if (!name || !email || !msg) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span style="opacity:0.7">Sending…</span>';
      }
      showStatus('Sending message…', '');

      const serviceID = 'service_fmxln33';
      const templateID = 'template_dcg9xpl';

      if (window.emailjs && emailjs.sendForm) {
        emailjs.sendForm(serviceID, templateID, this)
          .then(() => {
            showStatus('✓ Message sent — thank you!', 'success');
            form.reset();
          })
          .catch(err => {
            showStatus('Send failed. Please try email directly.', 'error');
            console.error('EmailJS error:', err);
          })
          .finally(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
            }
          });
      } else {
        // Fallback mailto
        const subj = encodeURIComponent(form.subject.value || 'Contact from roecosystem.in');
        const body = encodeURIComponent(`From: ${name} (${email})\n\n${msg}`);
        window.open(`mailto:rahulkota0101@gmail.com?subject=${subj}&body=${body}`, '_blank');
        showStatus('Opening email client…', 'success');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        }
      }
    });

    function showStatus(msg, type) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = 'form-status' + (type ? ' ' + type : '');
    }
  }

  /* ====================================================
     14. MAIN SCROLL HANDLER
  ==================================================== */
  function onScroll() {
    updateProgress();
    updateHeader();
  }

  /* ====================================================
     15. INIT ALL
  ==================================================== */
  function init() {
    // Scroll listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run once on load

    initThemeToggle();

    // Navigation
    initSmoothScroll();
    initMobileNav();
    initDataHref();

    // Animations
    initReveal();
    initCountUp();
    initCardTilt();
    initMagneticButtons();
    initTextScramble();
    initCursorTrail();
    initParallax();

    // Form
    initEmailJS();
  }

  /* ====================================================
     16. UNDER-DEVELOPMENT MODAL
  ==================================================== */
  const DEV_TOOLS = {
    'tool-1': 'RO Virtual Research Lab',
    'tool-2': 'RO-Link',
    'tool-3': 'RO Nexus',
  };

  let matrixRafId = null;

  function startMatrixRain() {
    const canvas = document.getElementById('dev-matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Size canvas to its CSS rendered size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 460;
    canvas.height = rect.height || 200;

    const W = canvas.width;
    const H = canvas.height;
    const FONT_SIZE = 11;
    const COLS = Math.floor(W / FONT_SIZE);

    // Mix of matrix chars + code symbols for realism
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01アBinaryFunctionClassReturn{};=>0x9sFALSE_TRUE_NULL_VOID_INT';
    const drops = Array.from({ length: COLS }, () => Math.random() * -H / FONT_SIZE | 0);

    function drawFrame() {
      // Semi-transparent black wipe for trail effect
      ctx.fillStyle = 'rgba(5, 5, 8, 0.18)';
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < COLS; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * FONT_SIZE;
        const x = i * FONT_SIZE;

        // Lead char: bright white-cyan
        const isFront = drops[i] * FONT_SIZE > H * 0.15;
        const r = Math.random();
        if (r > 0.92) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = 8;
        } else if (r > 0.6) {
          ctx.fillStyle = '#00f5ff';
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = 4;
        } else {
          // Occasionally violet for variety
          ctx.fillStyle = r > 0.3 ? 'rgba(0,245,255,0.7)' : 'rgba(167,139,250,0.6)';
          ctx.shadowBlur = 0;
        }

        ctx.font = `${FONT_SIZE}px "Courier New", monospace`;
        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        // Reset drop when off-screen with some randomness
        if (y > H && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      matrixRafId = requestAnimationFrame(drawFrame);
    }

    drawFrame();
  }

  function stopMatrixRain() {
    if (matrixRafId) {
      cancelAnimationFrame(matrixRafId);
      matrixRafId = null;
    }
  }

  /* Progress label cycling */
  const COMPILE_LABELS = [
    'COMPILING…', 'INIT MODULES…', 'LINKING…', 'BOOT SEQUENCE…',
    'AWAIT DEPLOY…', 'BUILD: 78%', 'STANDBY…'
  ];

  let labelIntervalId = null;

  function startProgressLabel() {
    const el = document.getElementById('dev-progress-label');
    if (!el) return;
    let idx = 0;
    el.textContent = COMPILE_LABELS[idx];
    labelIntervalId = setInterval(() => {
      idx = (idx + 1) % COMPILE_LABELS.length;
      el.textContent = COMPILE_LABELS[idx];
    }, 1800);
  }

  function stopProgressLabel() {
    if (labelIntervalId) { clearInterval(labelIntervalId); labelIntervalId = null; }
  }

  /* Reset progress bar animation by re-cloning element */
  function resetProgressBar() {
    const fill = document.getElementById('dev-progress-fill');
    if (!fill) return;
    const clone = fill.cloneNode(true);
    fill.parentNode.replaceChild(clone, fill);
  }

  /* Open modal */
  function openDevModal(toolId) {
    const modal = document.getElementById('dev-modal');
    const toolNameEl = document.getElementById('dev-tool-name');
    if (!modal) return;

    const name = DEV_TOOLS[toolId] || 'This Tool';
    if (toolNameEl) toolNameEl.textContent = name;

    // Update contact mailto subject
    const contactBtn = document.getElementById('dev-contact-btn');
    if (contactBtn) {
      const subject = encodeURIComponent(`Collaboration Interest — ${name} (RO Ecosystem)`);
      contactBtn.href = `mailto:rahulkota0101@gmail.com?subject=${subject}`;
    }

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    resetProgressBar();
    startMatrixRain();
    startProgressLabel();

    // Focus close button for keyboard accessibility
    const closeBtn = document.getElementById('dev-modal-close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 60);
  }

  /* Close modal */
  function closeDevModal() {
    const modal = document.getElementById('dev-modal');
    if (!modal) return;
    stopMatrixRain();
    stopProgressLabel();

    // Animate out
    const box = modal.querySelector('.dev-modal-box');
    if (box) {
      box.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      box.style.opacity = '0';
      box.style.transform = 'translateY(20px) scale(0.95)';
    }

    setTimeout(() => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (box) { box.style.transition = ''; box.style.opacity = ''; box.style.transform = ''; }
    }, 260);
  }

  function initDevModal() {
    // Wire close button
    const closeBtn = document.getElementById('dev-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDevModal);

    // Wire backdrop click
    const backdrop = document.querySelector('.dev-modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeDevModal);

    // Wire "Research Talk" button to also close modal
    const collabBtn = document.getElementById('dev-collab-btn');
    if (collabBtn) {
      collabBtn.addEventListener('click', (e) => {
        closeDevModal();
        // Smooth scroll handled by existing initSmoothScroll()
      });
    }

    // Keyboard: Escape
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('dev-modal');
      if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
        closeDevModal();
      }
    });

    // Wire the 3 non-functional tool cards
    Object.keys(DEV_TOOLS).forEach(toolId => {
      const card = document.getElementById(toolId);
      if (!card) return;

      // Remove old data-href navigation for these cards
      card.removeAttribute('data-href');
      card.style.cursor = 'pointer';

      // Remove any inline onclick (only tool-0 has inline onclick)
      // Tool-1, 2, 3 don't, but clean up data-href from their buttons too
      card.querySelectorAll('[data-href]').forEach(el => el.removeAttribute('data-href'));

      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDevModal(toolId);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDevModal(toolId);
        }
      });
    });
  }

  // ── Patch init() to also call initDevModal ──
  const _originalInit = init;
  function initAll() {
    _originalInit();
    initDevModal();
  }

  if (document.readyState === 'loading') {
    document.removeEventListener('DOMContentLoaded', init);
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
