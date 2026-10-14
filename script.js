// script.js – handles navbar scroll effect and gallery carousel

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Gallery carousel implementation
const galleryTrack = document.querySelector('.gallery-track');
const slides = Array.from(galleryTrack.children);
const dotsNav = document.querySelector('.gallery-dots');
const dots = Array.from(dotsNav.children);

// Set initial state – first slide active
if (slides.length) {
  slides[0].classList.add('current-slide');
}
if (dots.length) {
  dots[0].classList.add('active');
}

// Position slides side‑by‑side
const slideWidth = slides[0].getBoundingClientRect().width;
slides.forEach((slide, i) => {
  slide.style.left = `${slideWidth * i}px`;
});

const moveToSlide = (track, current, target) => {
  track.style.transform = `translateX(-${target.style.left})`;
  current.classList.remove('current-slide');
  target.classList.add('current-slide');
};

const updateDots = (current, target) => {
  current.classList.remove('active');
  target.classList.add('active');
};

// Dot navigation
dotsNav.addEventListener('click', e => {
  const targetDot = e.target.closest('div');
  if (!targetDot) return;
  const currentSlide = galleryTrack.querySelector('.current-slide');
  const currentDot = dotsNav.querySelector('.active');
  const targetIndex = dots.findIndex(dot => dot === targetDot);
  const targetSlide = slides[targetIndex];
  moveToSlide(galleryTrack, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
});

// Auto‑advance
let slideInterval = setInterval(() => {
  const currentSlide = galleryTrack.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling || slides[0];
  const currentDot = dotsNav.querySelector('.active');
  const nextDot = currentDot.nextElementSibling || dots[0];
  moveToSlide(galleryTrack, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
}, 5000);

// Pause on hover
const galleryCarousel = document.querySelector('.gallery-carousel');
galleryCarousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
galleryCarousel.addEventListener('mouseleave', () => {
  slideInterval = setInterval(() => {
    const currentSlide = galleryTrack.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling || slides[0];
    const currentDot = dotsNav.querySelector('.active');
    const nextDot = currentDot.nextElementSibling || dots[0];
    moveToSlide(galleryTrack, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
  }, 5000);
});
