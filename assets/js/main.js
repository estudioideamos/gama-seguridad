// Nav burger toggle
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
if (navBurger && navLinks) {
  navBurger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Back to top
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 500);
  });
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// WhatsApp float — only appears once the hero has fully scrolled out of view,
// so it never overlaps the hero CTA buttons at any viewport size
const waFloat = document.querySelector('.wa-float');
const heroSection = document.getElementById('inicio');
if (waFloat && heroSection && 'IntersectionObserver' in window) {
  const heroIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => waFloat.classList.toggle('show', !entry.isIntersecting));
  }, { threshold: 0 });
  heroIo.observe(heroSection);
} else if (waFloat) {
  waFloat.classList.add('show');
}

// Animated stat counters
const statEls = document.querySelectorAll('.stat-item b[data-count]');
if ('IntersectionObserver' in window && statEls.length) {
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statIo.observe(el));
}

// Header reacts to scroll (denser background + shadow once scrolled)
const header = document.querySelector('.header');
if (header) {
  const toggleHeader = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', toggleHeader);
  toggleHeader();
}

// Pointer-aware micro-interactions — skip on touch devices
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canHover) {
  // 3D tilt on service cards, following the cursor
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', (px * 6).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (-py * 6).toFixed(2) + 'deg');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  // Ambient glow that follows the cursor across dark sections
  const glowEl = document.createElement('div');
  glowEl.className = 'cursor-glow';
  document.body.appendChild(glowEl);
  let glowRaf = null;
  document.addEventListener('mousemove', (e) => {
    if (glowRaf) return;
    glowRaf = requestAnimationFrame(() => {
      glowEl.style.transform = `translate(${e.clientX}px, ${e.clientY + window.scrollY}px)`;
      glowEl.style.opacity = '1';
      glowRaf = null;
    });
  });

  // Subtle parallax on the hero photo
  const heroFrame = document.querySelector('.hero-frame-inner img');
  const heroSectionEl = document.getElementById('inicio');
  if (heroFrame && heroSectionEl) {
    heroSectionEl.addEventListener('mousemove', (e) => {
      const r = heroSectionEl.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroFrame.style.transform = `scale(1.06) translate(${px * -12}px, ${py * -10}px)`;
    });
    heroSectionEl.addEventListener('mouseleave', () => {
      heroFrame.style.transform = '';
    });
  }
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form (demo — no backend wired yet)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Consulta enviada ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      contactForm.reset();
    }, 2800);
  });
}
