// DOM Elements
const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-slide');
const nextBtn = document.querySelector('.next-slide');

// Variables
let currentSlide = 0;
let slideInterval;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Initialize the App
function initApp() {
  // Mobile Menu Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Scroll Event for Header
  window.addEventListener('scroll', handleScroll);

  // Testimonial Slider
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => changeSlide('prev'));
    nextBtn.addEventListener('click', () => changeSlide('next'));
  }

  // Testimonial Dots
  if (dots.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        goToSlide(slideIndex);
      });
    });
  }

  // Auto-rotate testimonials
  startSlideInterval();

  // Stop auto-rotation on hover
  const testimonialSlider = document.querySelector('.testimonials-slider');
  if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    testimonialSlider.addEventListener('mouseleave', () => {
      startSlideInterval();
    });
  }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  mobileToggle.classList.toggle('active');
  mainNav.classList.toggle('active');
  
  // Prevent scrolling when menu is open
  if (mainNav.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Handle Scroll for Header
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Change Testimonial Slide
function changeSlide(direction) {
  if (direction === 'next') {
    currentSlide = (currentSlide + 1) % slides.length;
  } else {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  }
  goToSlide(currentSlide);
}

// Go to Specific Slide
function goToSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
}

// Start Slide Interval
function startSlideInterval() {
  slideInterval = setInterval(() => {
    changeSlide('next');
  }, 5000);
}

// Form Validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.style.display = 'block';
        } else {
          const message = document.createElement('span');
          message.className = 'error-message';
          message.textContent = 'This field is required';
          message.style.color = 'red';
          message.style.fontSize = '1.2rem';
          message.style.marginTop = '0.5rem';
          message.style.display = 'block';
          field.parentNode.insertBefore(message, field.nextSibling);
        }
      } else {
        field.classList.remove('error');
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.style.display = 'none';
        }
      }
    });
    
    if (!isValid) {
      e.preventDefault();
    }
  });
  
  // Real-time validation
  const inputFields = form.querySelectorAll('input, textarea');
  inputFields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('error');
      } else {
        field.classList.remove('error');
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.style.display = 'none';
        }
      }
    });
  });
}

// Animate on Scroll
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize animations if supported
if ('IntersectionObserver' in window) {
  window.addEventListener('load', initScrollAnimations);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Close mobile menu if open
      if (mainNav.classList.contains('active')) {
        toggleMobileMenu();
      }
      
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  });
});