/**
 * Portfolio Website — app.js
 * Handles theme toggle, navigation, and scroll animations.
 */

(function () {
  'use strict';

  /* ── DOM References ── */
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav__link');
  const themeToggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');
  const revealElements = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const contactSubmit = document.getElementById('contact-submit');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const countryCodeSelect = document.getElementById('country-code');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');

  /* Valid email: name@domain.tld (e.g. user@gmail.com, user@company.co.in) */
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^[0-9]{10}$/;

  /* Paste your Google Apps Script Web app URL here (ends with /exec) */
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHLKHxOuAbAOW60w-p8myJ7YIVVJ18kDY_ZpgkyAPXNj7-LhRHwGE378s2TRZWogLC-g/exec';

  /* ── Theme (Dark / Light) ── */
  const THEME_KEY = 'portfolio-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    setTheme(getPreferredTheme());
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ── Mobile Navigation ── */
  function toggleNav() {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* ── Header Scroll Effect ── */
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Active Nav Link on Scroll ── */
  const sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  /* ── Scroll Reveal Animations ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Footer Year ── */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Contact Form → Google Sheets ── */
  function setContactStatus(type, message) {
    if (!contactStatus) return;
    contactStatus.textContent = message;
    contactStatus.className = 'contact-form__status';
    if (type) contactStatus.classList.add(`contact-form__status--${type}`);
  }

  function setFieldError(input, errorEl, message) {
    if (!input || !errorEl) return false;
    if (message) {
      input.classList.add('is-invalid');
      errorEl.textContent = message;
      return false;
    }
    input.classList.remove('is-invalid');
    errorEl.textContent = '';
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      return setFieldError(emailInput, emailError, 'Email is required.');
    }
    if (!EMAIL_REGEX.test(value)) {
      return setFieldError(
        emailInput,
        emailError,
        'Enter a valid email (e.g. name@gmail.com, name@company.co.in).'
      );
    }
    return setFieldError(emailInput, emailError, '');
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    if (!value) {
      return setFieldError(phoneInput, phoneError, 'Phone number is required.');
    }
    if (!PHONE_REGEX.test(value)) {
      return setFieldError(phoneInput, phoneError, 'Enter exactly 10 digits (numbers only).');
    }
    return setFieldError(phoneInput, phoneError, '');
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (phoneError.textContent) validatePhone();
    });

    phoneInput.addEventListener('blur', validatePhone);
  }

  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
      if (emailError.textContent) validateEmail();
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (GOOGLE_SCRIPT_URL.includes('PASTE_YOUR_WEB_APP_URL')) {
        setContactStatus('error', 'Form not configured yet — add your Google Script URL in app.js.');
        return;
      }

      const honeypot = contactForm.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      const emailValid = validateEmail();
      const phoneValid = validatePhone();

      const formData = new FormData(contactForm);
      const name = formData.get('name').trim();
      const message = formData.get('message').trim();
      const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
      const phoneDigits = phoneInput.value.trim();
      /* Wrap country code in parentheses so Sheets doesn't treat leading + as a formula */
      const fullPhone = `(${countryCode}) ${phoneDigits}`;

      if (!name || !message) {
        setContactStatus('error', 'Please fill in all fields.');
        return;
      }

      if (!emailValid || !phoneValid) {
        setContactStatus('error', 'Please fix the errors above before submitting.');
        return;
      }

      const params = new URLSearchParams({
        name,
        email: emailInput.value.trim(),
        phone: fullPhone,
        message,
      });

      contactSubmit.disabled = true;
      contactSubmit.textContent = 'Sending...';
      setContactStatus('', '');

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });

        contactForm.reset();
        if (countryCodeSelect) countryCodeSelect.value = '+91';
        setFieldError(emailInput, emailError, '');
        setFieldError(phoneInput, phoneError, '');
        setContactStatus('success', 'Thank you! Your message has been sent. I\'ll get back to you soon.');
      } catch {
        setContactStatus('error', 'Something went wrong. Please try again or email me directly.');
      } finally {
        contactSubmit.disabled = false;
        contactSubmit.textContent = 'Send Message';
      }
    });
  }

  /* ── Init ── */
  initTheme();
})();
