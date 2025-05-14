// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  if (document.querySelector('.testimonials-slider')) {
    new TestimonialSlider();
  }

  // Initialize form validation for all forms
  document.querySelectorAll('form').forEach(form => {
    new FormValidator(form);
  });

  // Initialize FAQ accordion if present
  if (document.querySelector('.faq-list')) {
    new FAQAccordion();
  }

  // Initialize file upload if present
  if (document.querySelector('.file-drop-area')) {
    new FileUploadHandler();
  }

  // Initialize mobile navigation
  new MobileNavigation();

  // Initialize reading progress if on a long page
  if (document.body.scrollHeight > window.innerHeight * 2) {
    new ReadingProgress();
  }

  // Initialize scroll animations
  new ScrollAnimations();

  // Initialize service selector if on services page
  if (document.querySelector('.service-selector')) {
    new ServiceSelector();
  }

  // Initialize sticky header
  new StickyHeader();

  // Initialize newsletter subscription if present
  if (document.querySelector('.newsletter-form')) {
    new NewsletterSubscription();
  }
}); 