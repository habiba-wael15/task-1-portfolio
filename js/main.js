/* ==========================================================================
   main.js – general page behaviour
   1. Dark / light theme toggle (saved in localStorage)
   2. Navbar style change on scroll
   3. Close the mobile menu after clicking a link
   4. Current year in the footer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Dark / light theme toggle ---------- */
  const THEME_KEY = 'portfolio-theme';
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // Applies a theme and updates the toggle button's icon and label
  function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme);

    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    // In dark mode we show a sun (click to go light), and vice versa
    themeIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }

  // Sync the button with the theme already set in <head> (dark by default)
  applyTheme(root.getAttribute('data-bs-theme') || 'dark');

  themeToggle.addEventListener('click', function () {
    const currentTheme = root.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);

    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      // Storage may be blocked (e.g. private mode) – the theme still changes for this visit
    }
  });


  /* ---------- 2. Navbar style change on scroll ---------- */
  const navbar = document.getElementById('mainNav');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar);


  /* ---------- 3. Close the mobile menu after clicking a link ---------- */
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('.nav-link');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // "show" means the collapsed mobile menu is currently open
      if (navMenu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });


  /* ---------- 4. Current year in the footer ---------- */
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

