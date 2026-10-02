// Enhance the existing content; everything stays readable without JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets = document.querySelectorAll('.experience > *, .section-heading, .speaker-grid > *, .details > *, .catering-layout > *, .ticket-layout > *, .book-section, .faq-section');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealTargets.forEach(element => {
    // Never hide content already on screen or when reduced motion is preferred.
    if (!reducedMotion.matches && element.getBoundingClientRect().top > innerHeight) {
      element.classList.add('reveal-pending');
      observer.observe(element);
    }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) revealTargets.forEach(element => element.classList.remove('reveal-pending'));
  });
}

const promise = document.querySelector('.promise');
const slides = [...promise.querySelectorAll('li')];
const track = promise.querySelector('ul');
let current = 0;
promise.classList.add('promise-carousel');
promise.setAttribute('role', 'region');
promise.setAttribute('aria-roledescription', 'carousel');
promise.setAttribute('aria-label', 'Messages of hope');
track.id = 'hope-slides';
track.setAttribute('aria-live', 'polite');
track.setAttribute('aria-atomic', 'true');
const controls = document.createElement('nav');
controls.className = 'carousel-controls';
controls.setAttribute('aria-label', 'Messages of hope controls');
controls.innerHTML = `<button type="button" class="carousel-arrow" aria-label="Previous message" aria-controls="hope-slides">←</button><span class="carousel-dots">${slides.map((slide, index) => `<button type="button" aria-label="Show message ${index + 1}: ${slide.textContent}" aria-controls="hope-slides"><span></span></button>`).join('')}</span><button type="button" class="carousel-arrow" aria-label="Next message" aria-controls="hope-slides">→</button>`;
track.after(controls);
const dots = [...controls.querySelectorAll('.carousel-dots button')];
function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== current; });
  dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
}
controls.querySelector('[aria-label="Previous message"]').addEventListener('click', () => showSlide(current - 1));
controls.querySelector('[aria-label="Next message"]').addEventListener('click', () => showSlide(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
controls.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  showSlide(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
  dots[current].focus();
});
let touchStart;
track.addEventListener('touchstart', event => {
  touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
track.addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showSlide(current + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
track.addEventListener('touchcancel', () => { touchStart = null; });
showSlide(0);

// A disclosure menu keeps normal link and keyboard behavior.
const siteHeader = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('#main-navigation');
const mobileNavigation = window.matchMedia('(max-width: 760px)');
function closeMenu(returnFocus = false) {
  siteHeader.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  if (returnFocus) menuToggle.focus({ preventScroll: true });
}
menuToggle.hidden = false;
siteHeader.classList.add('menu-ready');
document.body.classList.add('mobile-nav-ready');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  siteHeader.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
});
mainNavigation.addEventListener('click', event => {
  if (mobileNavigation.matches && event.target.closest('a')) closeMenu(true);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && siteHeader.classList.contains('menu-open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!siteHeader.contains(event.target)) closeMenu(mainNavigation.contains(document.activeElement));
});
siteHeader.addEventListener('focusout', event => {
  if (!siteHeader.contains(event.relatedTarget)) closeMenu();
});
mobileNavigation.addEventListener('change', () => {
  const focusWillHide = mobileNavigation.matches && mainNavigation.contains(document.activeElement);
  closeMenu(focusWillHide);
});
