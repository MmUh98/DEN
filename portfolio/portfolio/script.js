// Animated role text in hero semicircle
const roles = [
  'AI Engineer',
  'Python Developer',
  'Automation',
  'Machine Learning'
];
let roleIndex = 0;
const roleSpan = document.getElementById('animated-role');
if (roleSpan) {
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleSpan.textContent = roles[roleIndex];
  }, 1200);
}

// --- Mobile Menu Toggle ---
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

// --- Scroll to Top Button ---
const scrollBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Light/Dark Mode Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.innerHTML = theme === 'dark' ? '🌙' : '☀️';
};
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// --- Smooth Scroll Navigation ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}); 