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

// Hero Slider Class
class HeroSlider {
    constructor() {
        this.slides = [
            {
                image: 'img/hero-1.jpg.jpg',
                title: 'Strategic Advocacy for Your Insurance Claim',
                subtitle: 'Expert guidance through the complex world of insurance claims'
            },
            {
                image: 'img/hero-2.jpg.jpg',
                title: 'Maximize Your Insurance Settlement',
                subtitle: 'Professional representation to ensure you receive every dollar you deserve'
            },
            {
                image: 'img/hero-3.jpg.jpg',
                title: 'Your Trusted Claims Advocate',
                subtitle: 'Dedicated to protecting your interests and securing fair compensation'
            }
        ];
        this.currentSlide = 0;
        this.sliderContainer = document.querySelector('.hero-slider');
        this.heroContent = document.querySelector('.hero-content');
        this.init();
    }

    init() {
        // Create slide elements
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            slideElement.style.backgroundImage = `url(${slide.image})`;
            this.sliderContainer.appendChild(slideElement);
        });

        // Create navigation controls
        this.createNavigationControls();

        // Update initial content
        this.updateContent();

        // Start slideshow
        this.startSlideshow();
    }

    createNavigationControls() {
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'hero-slider-nav';

        // Create previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'hero-nav-btn prev-slide';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.addEventListener('click', () => this.prevSlide());

        // Create next button
        const nextButton = document.createElement('button');
        nextButton.className = 'hero-nav-btn next-slide';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.addEventListener('click', () => this.nextSlide());

        // Add buttons to container
        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);

        // Add navigation to slider
        this.sliderContainer.appendChild(navContainer);
    }

    updateContent() {
        const currentSlideData = this.slides[this.currentSlide];
        const titleElement = this.heroContent.querySelector('h1');
        const subtitleElement = this.heroContent.querySelector('p');

        // Add fade-out effect
        titleElement.style.opacity = '0';
        subtitleElement.style.opacity = '0';

        // Update content after a short delay
        setTimeout(() => {
            titleElement.textContent = currentSlideData.title;
            subtitleElement.textContent = currentSlideData.subtitle;
            
            // Add fade-in effect
            titleElement.style.opacity = '1';
            subtitleElement.style.opacity = '1';
        }, 300);
    }

    startSlideshow() {
        setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    nextSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        slides[this.currentSlide].classList.add('active');
        this.updateContent();
    }

    prevSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
        slides[this.currentSlide].classList.add('active');
        this.updateContent();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Initialize the App
function initApp() {
  // Initialize Hero Slider
  if (document.querySelector('.hero-slider')) {
    new HeroSlider();
  }

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