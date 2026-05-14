/**
 * KARAN SHAKARWAL — PORTFOLIO SCRIPTS
 * Features:
 *  1. Navbar scroll shadow
 *  2. Mobile hamburger menu
 *  3. Smooth scroll (native, with fallback)
 *  4. Scroll-triggered fade-in animations (IntersectionObserver)
 *  5. Contact form pseudo-submission
 */

/* ─────────────────────────────────────────────
   1. NAVBAR — add shadow on scroll
   ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ─────────────────────────────────────────────
   2. HAMBURGER MENU — toggle mobile nav
   ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  // Accessibility: announce state to screen readers
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  }
});


/* ─────────────────────────────────────────────
   3. SMOOTH SCROLL — polyfill for older browsers
      (Modern browsers handle this via CSS scroll-behavior)
   ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    // If browser supports CSS scroll-behavior natively, let CSS handle it;
    // otherwise use JS scrollIntoView.
    const supportsNativeSmooth = 'scrollBehavior' in document.documentElement.style;
    if (!supportsNativeSmooth) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ─────────────────────────────────────────────
   4. FADE-IN ANIMATIONS — IntersectionObserver
   ───────────────────────────────────────────── */
const observerOptions = {
  root: null,
  threshold: 0.12,       // trigger when 12% of element is visible
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after triggering so animation only fires once
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with the fade-up class
document.querySelectorAll('.fade-up').forEach(el => {
  fadeObserver.observe(el);
});


/* ─────────────────────────────────────────────
   5. CONTACT FORM — client-side pseudo-submission
      (Replace this with a backend / Formspree call
       for actual email delivery)
   ───────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  // Basic client-side validation
  if (!name || !email || !message) {
    showFormNote('Please fill in all fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormNote('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate async send (replace with fetch() to a real endpoint)
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    showFormNote(`Thanks ${name}! I'll get back to you soon. ✓`, 'success');
    contactForm.reset();
  }, 1200);
});

/** Simple email regex validator */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Display a note below the form */
function showFormNote(message, type) {
  formNote.textContent = message;
  formNote.style.color = type === 'error' ? '#e03131' : '#1a9a52';

  // Auto-clear after 5 seconds
  clearTimeout(formNote._timeout);
  formNote._timeout = setTimeout(() => {
    formNote.textContent = '';
  }, 5000);
}


/* ─────────────────────────────────────────────
   6. HERO — trigger fade-ups immediately on load
   ───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Elements inside hero won't be caught by observer (already in viewport),
  // so we manually add 'visible' with a small stagger after page load.
  const heroEls = document.querySelectorAll('.hero .fade-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 80 + i * 120);
  });
});
