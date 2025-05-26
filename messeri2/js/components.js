# JavaScript Components for Messeri & Associates Website

This artifact documents the JavaScript components for enhancing the Messeri & Associates website user experience. These components include a testimonial slider, form validation, interactive FAQ accordions, file uploads for claims, and more.

## Table of Contents

1. [Testimonial Slider](#testimonial-slider)
2. [Form Validation](#form-validation)
3. [FAQ Accordion](#faq-accordion)
4. [File Upload Handler](#file-upload-handler)
5. [Mobile Navigation](#mobile-navigation)
6. [Reading Progress Bar](#reading-progress-bar)
7. [Scroll Animations](#scroll-animations)
8. [Interactive Service Selection](#interactive-service-selection)
9. [Sticky Header](#sticky-header)
10. [Newsletter Subscription](#newsletter-subscription)

## Testimonial Slider

```javascript
// js/components/testimonial_slider.js

export class TestimonialSlider {
  constructor(options = {}) {
    this.sliderSelector = options.sliderSelector || '.testimonials-slider';
    this.slideSelector = options.slideSelector || '.testimonial-slide';
    this.dotSelector = options.dotSelector || '.dot';
    this.prevBtnSelector = options.prevBtnSelector || '.prev-slide';
    this.nextBtnSelector = options.nextBtnSelector || '.next-slide';
    this.activeClass = options.activeClass || 'active';
    this.autoplaySpeed = options.autoplaySpeed || 5000;
    this.animationSpeed = options.animationSpeed || 300;
    
    this.slider = document.querySelector(this.sliderSelector);
    
    if (!this.slider) return;
    
    this.slides = this.slider.querySelectorAll(this.slideSelector);
    this.dots = document.querySelectorAll(this.dotSelector);
    this.prevBtn = document.querySelector(this.prevBtnSelector);
    this.nextBtn = document.querySelector(this.nextBtnSelector);
    
    this.slideCount = this.slides.length;
    this.currentSlide = 0;
    this.interval = null;
    
    this.init();
  }
  
  init() {
    // Setup initial state
    this.showSlide(this.currentSlide);
    
    // Add event listeners
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Mouse hover controls
    this.slider.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.slider.addEventListener('mouseleave', () => this.startAutoplay());
    
    // Start autoplay
    this.startAutoplay();
    
    // Add swipe support for mobile
    this.addSwipeSupport();
  }
  
  showSlide(index) {
    // Hide all slides
    this.slides.forEach(slide => {
      slide.classList.remove(this.activeClass);
      slide.style.display = 'none';
    });
    
    // Remove active class from all dots
    this.dots.forEach(dot => {
      dot.classList.remove(this.activeClass);
    });
    
    // Show the current slide
    this.slides[index].classList.add(this.activeClass);
    this.slides[index].style.display = 'block';
    
    // Add active class to current dot
    if (this.dots[index]) {
      this.dots[index].classList.add(this.activeClass);
    }
    
    // Update current slide index
    this.currentSlide = index;
  }
  
  nextSlide() {
    this.showSlide((this.currentSlide + 1) % this.slideCount);
  }
  
  prevSlide() {
    this.showSlide((this.currentSlide - 1 + this.slideCount) % this.slideCount);
  }
  
  goToSlide(index) {
    this.showSlide(index);
  }
  
  startAutoplay() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.autoplaySpeed);
  }
  
  pauseAutoplay() {
    clearInterval(this.interval);
  }
  
  addSwipeSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.slider.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
    
    this.handleSwipe = () => {
      const swipeThreshold = 50;
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swiped left - next slide
        this.nextSlide();
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swiped right - previous slide
        this.prevSlide();
      }
    };
  }
  
  // Public method to destroy slider
  destroy() {
    this.pauseAutoplay();
    
    this.prevBtn?.removeEventListener('click', this.prevSlide);
    this.nextBtn?.removeEventListener('click', this.nextSlide);
    
    this.dots.forEach(dot => {
      dot.removeEventListener('click', this.goToSlide);
    });
    
    this.slider.removeEventListener('mouseenter', this.pauseAutoplay);
    this.slider.removeEventListener('mouseleave', this.startAutoplay);
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const testimonialSlider = new TestimonialSlider();
});
```

## Form Validation

```javascript
// js/components/form_validation.js

export class FormValidator {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;
    
    this.options = {
      errorClass: options.errorClass || 'error',
      errorMessageClass: options.errorMessageClass || 'error-message',
      errorMessageStyle: options.errorMessageStyle || 'color: red; font-size: 1.2rem; margin-top: 0.5rem;',
      validateOnInput: options.validateOnInput !== undefined ? options.validateOnInput : true,
      validateOnSubmit: options.validateOnSubmit !== undefined ? options.validateOnSubmit : true,
      scrollToFirstError: options.scrollToFirstError !== undefined ? options.scrollToFirstError : true,
      ...options
    };
    
    this.init();
  }
  
  init() {
    if (this.options.validateOnSubmit) {
      this.form.addEventListener('submit', (e) => {
        if (!this.validateForm()) {
          e.preventDefault();
          
          // Scroll to first error
          if (this.options.scrollToFirstError) {
            const firstError = this.form.querySelector(`.${this.options.errorClass}`);
            if (firstError) {
              firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          }
        }
      });
    }
    
    if (this.options.validateOnInput) {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          this.validateField(input);
        });
        
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    }
  }
  
  validateForm() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(field) {
    let isValid = true;
    
    // Clear previous error
    this.clearError(field);
    
    // Check for required fields
    if (field.hasAttribute('required') && !field.value.trim()) {
      this.showError(field, 'This field is required');
      isValid = false;
    }
    
    // Validate email format
    if (field.type === 'email' && field.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value)) {
        this.showError(field, 'Please enter a valid email address');
        isValid = false;
      }
    }
    
    // Validate phone number format
    if (field.type === 'tel' && field.value.trim()) {
      const phonePattern = /^[\d\s\-\(\)\.]+$/;
      if (!phonePattern.test(field.value)) {
        this.showError(field, 'Please enter a valid phone number');
        isValid = false;
      }
    }
    
    // Validate date format
    if (field.type === 'date' && field.value.trim()) {
      const date = new Date(field.value);
      if (isNaN(date.getTime())) {
        this.showError(field, 'Please enter a valid date');
        isValid = false;
      }
    }
    
    // Validate ZIP code
    if (field.id.includes('zip') && field.value.trim()) {
      const zipPattern = /^\d{5}(-\d{4})?$/;
      if (!zipPattern.test(field.value)) {
        this.showError(field, 'Please enter a valid ZIP code');
        isValid = false;
      }
    }
    
    // Validate checkboxes
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      this.showError(field, 'This checkbox is required');
      isValid = false;
    }
    
    // Custom validation based on data attributes
    if (field.dataset.minLength && field.value.length < parseInt(field.dataset.minLength)) {
      this.showError(field, `Minimum length is ${field.dataset.minLength} characters`);
      isValid = false;
    }
    
    return isValid;
  }
  
  showError(field, message) {
    // Add error class to the field
    field.classList.add(this.options.errorClass);
    
    // Check if error message element already exists
    const parentElement = field.parentElement;
    let errorMessage = parentElement.querySelector(`.${this.options.errorMessageClass}`);
    
    if (!errorMessage) {
      // Create error message element
      errorMessage = document.createElement('span');
      errorMessage.className = this.options.errorMessageClass;
      errorMessage.style = this.options.errorMessageStyle;
      
      // Insert error message after the field
      field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
  
  clearError(field) {
    // Remove error class from the field
    field.classList.remove(this.options.errorClass);
    
    // Find and hide error message
    const parentElement = field.parentElement;
    const errorMessage = parentElement.querySelector(`.${this.options.errorMessageClass}`);
    
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = new FormValidator('#contactForm');
  const claimForm = new FormValidator('#claimForm');
  const newsletterForm = new FormValidator('#newsletterForm');
});
```

## FAQ Accordion

```javascript
// js/components/faq_accordion.js

export class FAQAccordion {
  constructor(options = {}) {
    this.containerSelector = options.containerSelector || '.faq-list';
    this.questionSelector = options.questionSelector || '.faq-question';
    this.answerSelector = options.answerSelector || '.faq-answer';
    this.activeClass = options.activeClass || 'active';
    this.toggleOneOnly = options.toggleOneOnly !== undefined ? options.toggleOneOnly : true;
    this.animationSpeed = options.animationSpeed || 300;
    
    this.container = document.querySelector(this.containerSelector);
    
    if (!this.container) return;
    
    this.questions = this.container.querySelectorAll(this.questionSelector);
    
    this.init();
  }
  
  init() {
    this.questions.forEach(question => {
      question.addEventListener('click', () => {
        this.toggleQuestion(question);
      });
    });
  }
  
  toggleQuestion(question) {
    const isActive = question.classList.contains(this.activeClass);
    const answer = question.nextElementSibling;
    
    if (this.toggleOneOnly) {
      // Close all other questions
      this.questions.forEach(q => {
        if (q !== question) {
          q.classList.remove(this.activeClass);
          q.nextElementSibling.classList.remove(this.activeClass);
          q.nextElementSibling.style.maxHeight = '0';
        }
      });
    }
    
    // Toggle current question
    if (isActive) {
      question.classList.remove(this.activeClass);
      answer.classList.remove(this.activeClass);
      answer.style.maxHeight = '0';
    } else {
      question.classList.add(this.activeClass);
      answer.classList.add(this.activeClass);
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  }
  
  // Open specific FAQ by index
  openFaq(index) {
    if (index >= 0 && index < this.questions.length) {
      this.toggleQuestion(this.questions[index]);
    }
  }
  
  // Open FAQ by data-id attribute
  openFaqById(id) {
    const question = document.querySelector(`${this.questionSelector}[data-id="${id}"]`);
    if (question) {
      this.toggleQuestion(question);
    }
  }
  
  // Close all FAQs
  closeAll() {
    this.questions.forEach(question => {
      question.classList.remove(this.activeClass);
      question.nextElementSibling.classList.remove(this.activeClass);
      question.nextElementSibling.style.maxHeight = '0';
    });
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const faqAccordion = new FAQAccordion();
  
  // URL hash support to open specific FAQ
  if (window.location.hash) {
    const id = window.location.hash.substring(1);
    faqAccordion.openFaqById(id);
    
    // Scroll to the FAQ
    const faqElement = document.querySelector(`[data-id="${id}"]`);
    if (faqElement) {
      setTimeout(() => {
        faqElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
});
```

## File Upload Handler

```javascript
// js/components/file_upload.js

export class FileUploadHandler {
  constructor(options = {}) {
    this.dropAreaSelector = options.dropAreaSelector || '.file-drop-area';
    this.fileInputSelector = options.fileInputSelector || '.file-input';
    this.fileListSelector = options.fileListSelector || '.file-list';
    this.activeClass = options.activeClass || 'active';
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB
    this.allowedTypes = options.allowedTypes || null;
    this.maxFiles = options.maxFiles || 10;
    
    this.dropAreas = document.querySelectorAll(this.dropAreaSelector);
    
    if (!this.dropAreas.length) return;
    
    this.init();
  }
  
  init() {
    this.dropAreas.forEach(dropArea => {
      const fileInput = dropArea.querySelector(this.fileInputSelector);
      const fileList = document.getElementById(fileInput.getAttribute('data-file-list')) || 
                       dropArea.closest('form').querySelector(this.fileListSelector);
      
      // Open file dialog when clicking on drop area
      dropArea.addEventListener('click', () => {
        fileInput.click();
      });
      
      // Handle file selection via input
      fileInput.addEventListener('change', () => {
        this.handleFiles(fileInput.files, fileList, fileInput);
      });
      
      // Handle drag and drop
      dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add(this.activeClass);
      });
      
      dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove(this.activeClass);
      });
      
      dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove(this.activeClass);
        this.handleFiles(e.dataTransfer.files, fileList, fileInput);
      });
    });
  }
  
  handleFiles(files, fileList, fileInput) {
    if (!files || !fileList) return;
    
    // Get existing files count
    const existingFiles = fileList.querySelectorAll('.file-item').length;
    
    // Check max files limit
    if (existingFiles + files.length > this.maxFiles) {
      alert(`You can upload maximum ${this.maxFiles} files.`);
      return;
    }
    
    // Create FileList to store selected files
    let fileArray = [];
    if (fileInput.files && fileInput.files.length > 0) {
      fileArray = Array.from(fileInput.files);
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size
      if (file.size > this.maxFileSize) {
        alert(`File ${file.name} is too large. Maximum file size is ${this.formatFileSize(this.maxFileSize)}.`);
        continue;
      }
      
      // Validate file type
      if (this.allowedTypes && !this.validateFileType(file)) {
        alert(`File ${file.name} is not an allowed file type.`);
        continue;
      }
      
      // Create file item element
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      // File name
      const fileName = document.createElement('div');
      fileName.className = 'file-name';
      fileName.textContent = file.name;
      
      // File size
      const fileSize = document.createElement('div');
      fileSize.className = 'file-size';
      fileSize.textContent = this.formatFileSize(file.size);
      
      // Remove button
      const removeBtn = document.createElement('div');
      removeBtn.className = 'file-remove';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      
      removeBtn.addEventListener('click', () => {
        // Remove file from fileList
        fileItem.remove();
        
        // Remove file from fileArray
        const index = fileArray.indexOf(file);
        if (index > -1) {
          fileArray.splice(index, 1);
        }
        
        // Update the file input
        const dataTransfer = new DataTransfer();
        fileArray.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
      });
      
      // Append elements
      fileItem.appendChild(fileName);
      fileItem.appendChild(fileSize);
      fileItem.appendChild(removeBtn);
      fileList.appendChild(fileItem);
      
      // Add file to fileArray
      if (!fileArray.includes(file)) {
        fileArray.push(file);
      }
    }
    
    // Update the file input with all files (existing + new)
    const dataTransfer = new DataTransfer();
    fileArray.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
  }
  
  validateFileType(file) {
    if (!this.allowedTypes) return true;
    
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    return this.allowedTypes.some(type => {
      // Check MIME type
      if (fileType.includes(type)) return true;
      
      // Check file extension
      if (type.startsWith('.') && fileExtension === type.substring(1)) return true;
      
      return false;
    });
  }
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  // For photos
  const photoUpload = new FileUploadHandler({
    dropAreaSelector: '#photoDropArea',
    fileInputSelector: '#photoUpload',
    fileListSelector: '#photoList',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', '.jpg', '.jpeg', '.png', '.gif']
  });
  
  // For documents
  const docUpload = new FileUploadHandler({
    dropAreaSelector: '#docDropArea',
    fileInputSelector: '#docUpload',
    fileListSelector: '#docList',
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.pdf', '.doc', '.docx']
  });
});
```

## Mobile Navigation

```javascript
// js/components/mobile_navigation.js

export class MobileNavigation {
  constructor(options = {}) {
    this.mobileToggleSelector = options.mobileToggleSelector || '.mobile-toggle';
    this.mainNavSelector = options.mainNavSelector || '.main-nav';
    this.navLinksSelector = options.navLinksSelector || '.main-nav a';
    this.activeClass = options.activeClass || 'active';
    this.animationSpeed = options.animationSpeed || 300;
    this.closeOnLinkClick = options.closeOnLinkClick !== undefined ? options.closeOnLinkClick : true;
    this.preventBodyScroll = options.preventBodyScroll !== undefined ? options.preventBodyScroll : true;
    this.backdrop = options.backdrop !== undefined ? options.backdrop : true;
    
    this.mobileToggle = document.querySelector(this.mobileToggleSelector);
    this.mainNav = document.querySelector(this.mainNavSelector);
    this.navLinks = document.querySelectorAll(this.navLinksSelector);
    
    if (!this.mobileToggle || !this.mainNav) return;
    
    this.backdropElement = null;
    
    this.init();
  }
  
  init() {
    // Toggle mobile menu
    this.mobileToggle.addEventListener('click', () => {
      this.toggleMenu();
    });
    
    // Close menu on link click
    if (this.closeOnLinkClick) {
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });
    }
    
    // Close menu on resize if screen becomes larger
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
    
    // Create backdrop element
    if (this.backdrop) {
      this.backdropElement = document.createElement('div');
      this.backdropElement.className = 'mobile-nav-backdrop';
      this.backdropElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 998;
        display: none;
        opacity: 0;
        transition: opacity ${this.animationSpeed}ms ease;
      `;
      
      document.body.appendChild(this.backdropElement);
      
      this.backdropElement.addEventListener('click', () => {
        this.closeMenu();
      });
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    this.mobileToggle.classList.add(this.activeClass);
    this.mainNav.classList.add(this.activeClass);
    
    if (this.preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    }
    
    if (this.backdrop && this.backdropElement) {
      this.backdropElement.style.display = 'block';
      setTimeout(() => {
        this.backdropElement.style.opacity = '1';
      }, 10);
    }
  }
  
  closeMenu() {
    this.mobileToggle.classList.remove(this.activeClass);
    this.mainNav.classList.remove(this.activeClass);
    
    if (this.preventBodyScroll) {
      document.body.style.overflow = '';
    }
    
    if (this.backdrop && this.backdropElement) {
      this.backdropElement.style.opacity = '0';
      setTimeout(() => {
        this.backdropElement.style.display = 'none';
      }, this.animationSpeed);
    }
  }
  
  isMenuOpen() {
    return this.mainNav.classList.contains(this.activeClass);
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const mobileNav = new MobileNavigation();
});
```

## Reading Progress Bar

```javascript
// js/components/reading_progress.js

export class ReadingProgress {
  constructor(options = {}) {
    this.progressBarSelector = options.progressBarSelector || '#readingProgressBar';
    this.contentSelector = options.contentSelector || '.article-content';
    this.offset = options.offset || 0;
    
    this.progressBar = document.querySelector(this.progressBarSelector);
    this.content = document.querySelector(this.contentSelector);
    
    if (!this.progressBar || !this.content) return;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', this.updateProgress.bind(this));
    window.addEventListener('resize', this.updateProgress.bind(this));
    
    // Initial update
    this.updateProgress();
  }
  
  updateProgress() {
    // Get content dimensions
    const contentRect = this.content.getBoundingClientRect();
    const contentTop = contentRect.top + window.scrollY;
    const contentHeight = contentRect.height;
    const contentBottom = contentTop + contentHeight;
    
    // Get viewport dimensions
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollBottom = scrollTop + windowHeight;
    
    // Calculate progress percentage
    let progress = 0;
    
    if (scrollTop >= contentBottom) {
      progress = 100;
    } else if (scrollBottom > contentTop) {
      const visibleContent = Math.min(contentBottom, scrollBottom) - Math.max(contentTop, scrollTop);
      const visiblePercentage = visibleContent / Math.min(contentHeight, windowHeight);
      const scrollPercentage = (scrollTop - contentTop + windowHeight) / (contentHeight + windowHeight);
      
      progress = Math.min(100, Math.max(0, scrollPercentage * 100));
    }
    
    // Update progress bar
    this.progressBar.style.width = `${progress}%`;
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  // Initialize only on blog post pages
  if (document.querySelector('.blog-post-content')) {
    const readingProgress = new ReadingProgress();
  }
});
```

## Scroll Animations

```javascript
// js/components/scroll_animations.js

export class ScrollAnimations {
  constructor(options = {}) {
    this.animatedElementSelector = options.animatedElementSelector || '.animate-on-scroll';
    this.animatedClass = options.animatedClass || 'animated';
    this.offset = options.offset || 0.1; // 10% of the element is visible
    this.once = options.once !== undefined ? options.once : true;
    
    // Check if Intersection Observer is supported
    this.supportsIntersectionObserver = 'IntersectionObserver' in window;
    
    this.init();
  }
  
  init() {
    // Get all animated elements
    this.elements = document.querySelectorAll(this.animatedElementSelector);
    
    if (!this.elements.length) return;
    
    if (this.supportsIntersectionObserver) {
      this.setupIntersectionObserver();
    } else {
      this.setupFallback();
    }
  }
  
  setupIntersectionObserver() {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: this.offset
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          
          if (this.once) {
            this.observer.unobserve(entry.target);
          }
        } else if (!this.once) {
          this.resetElement(entry.target);
        }
      });
    }, options);
    
    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  }
  
  setupFallback() {
    // Fallback for browsers that don't support Intersection Observer
    window.addEventListener('scroll', this.checkElementsInView.bind(this));
    window.addEventListener('resize', this.checkElementsInView.bind(this));
    
    // Initial check
    this.checkElementsInView();
  }
  
  checkElementsInView() {
    this.elements.forEach(element => {
      if (this.isElementInView(element)) {
        this.animateElement(element);
      } else if (!this.once) {
        this.resetElement(element);
      }
    });
  }
  
  isElementInView(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
      rect.top <= windowHeight * (1 - this.offset) &&
      rect.bottom >= 0
    );
  }
  
  animateElement(element) {
    element.classList.add(this.animatedClass);
  }
  
  resetElement(element) {
    element.classList.remove(this.animatedClass);
  }
  
  // Public method to refresh animations (e.g., after adding new elements)
  refresh() {
    if (this.supportsIntersectionObserver && this.observer) {
      this.elements = document.querySelectorAll(this.animatedElementSelector);
      
      this.elements.forEach(element => {
        if (!element.classList.contains(this.animatedClass)) {
          this.observer.observe(element);
        }
      });
    } else {
      this.elements = document.querySelectorAll(this.animatedElementSelector);
      this.checkElementsInView();
    }
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const scrollAnimations = new ScrollAnimations();
  
  // Add animation classes to elements
  const animateElements = [
    { selector: '.service-card', animation: 'fade-up', delay: 0.1 },
    { selector: '.value-item', animation: 'fade-right', delay: 0.2 },
    { selector: '.process-step', animation: 'fade-left', delay: 0.3 },
    { selector: '.blog-post h2', animation: 'fade-in', delay: 0 }
  ];
  
  animateElements.forEach(({ selector, animation, delay }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('animate-on-scroll');
      element.dataset.animation = animation;
      element.style.transitionDelay = `${delay * index}s`;
    });
  });
});
```

## Interactive Service Selection

```javascript
// js/components/service_selector.js

export class ServiceSelector {
  constructor(options = {}) {
    this.selectorContainerSelector = options.selectorContainerSelector || '.service-selector';
    this.serviceButtonSelector = options.serviceButtonSelector || '.service-button';
    this.serviceContentSelector = options.serviceContentSelector || '.service-content';
    this.activeClass = options.activeClass || 'active';
    this.defaultService = options.defaultService || 0;
    this.changeUrl = options.changeUrl !== undefined ? options.changeUrl : true;
    this.urlParam = options.urlParam || 'service';
    
    this.container = document.querySelector(this.selectorContainerSelector);
    
    if (!this.container) return;
    
    this.buttons = this.container.querySelectorAll(this.serviceButtonSelector);
    this.contents = this.container.querySelectorAll(this.serviceContentSelector);
    
    this.init();
  }
  
  init() {
    // Add click event to buttons
    this.buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.showService(index);
      });
    });
    
    // Check URL params for service selection
    if (this.changeUrl) {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get(this.urlParam);
      
      if (serviceParam) {
        const serviceIndex = parseInt(serviceParam);
        if (!isNaN(serviceIndex) && serviceIndex >= 0 && serviceIndex < this.buttons.length) {
          this.showService(serviceIndex);
          return;
        }
      }
    }
    
    // Show default service
    this.showService(this.defaultService);
  }
  
  showService(index) {
    // Deactivate all buttons and contents
    this.buttons.forEach(button => {
      button.classList.remove(this.activeClass);
    });
    
    this.contents.forEach(content => {
      content.classList.remove(this.activeClass);
      content.style.display = 'none';
    });
    
    // Activate selected button and content
    if (this.buttons[index]) {
      this.buttons[index].classList.add(this.activeClass);
    }
    
    if (this.contents[index]) {
      this.contents[index].classList.add(this.activeClass);
      this.contents[index].style.display = 'block';
    }
    
    // Update URL if enabled
    if (this.changeUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set(this.urlParam, index);
      window.history.replaceState({}, '', url.toString());
    }
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const serviceSelector = new ServiceSelector();
});
```

## Sticky Header

```javascript
// js/components/sticky_header.js

export class StickyHeader {
  constructor(options = {}) {
    this.headerSelector = options.headerSelector || '.header';
    this.scrolledClass = options.scrolledClass || 'scrolled';
    this.hiddenClass = options.hiddenClass || 'hidden';
    this.threshold = options.threshold || 50;
    this.hideOnScrollDown = options.hideOnScrollDown || false;
    
    this.header = document.querySelector(this.headerSelector);
    
    if (!this.header) return;
    
    this.lastScrollTop = 0;
    this.headerHeight = this.header.offsetHeight;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.updateHeaderHeight.bind(this));
    
    // Initial check
    this.handleScroll();
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scrolled past threshold
    if (scrollTop > this.threshold) {
      this.header.classList.add(this.scrolledClass);
    } else {
      this.header.classList.remove(this.scrolledClass);
    }
    
    // Hide header on scroll down if enabled
    if (this.hideOnScrollDown) {
      if (scrollTop > this.lastScrollTop && scrollTop > this.headerHeight) {
        // Scrolling down
        this.header.classList.add(this.hiddenClass);
      } else {
        // Scrolling up
        this.header.classList.remove(this.hiddenClass);
      }
    }
    
    this.lastScrollTop = scrollTop;
  }
  
  updateHeaderHeight() {
    this.headerHeight = this.header.offsetHeight;
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const stickyHeader = new StickyHeader();
});
```

## Newsletter Subscription

```javascript
// js/components/newsletter_subscription.js

export class NewsletterSubscription {
  constructor(options = {}) {
    this.formSelector = options.formSelector || '.newsletter-form';
    this.inputSelector = options.inputSelector || 'input[type="email"]';
    this.submitButtonSelector = options.submitButtonSelector || 'button[type="submit"]';
    this.successMessageSelector = options.successMessageSelector || '.success-message';
    this.errorMessageSelector = options.errorMessageSelector || '.error-message';
    
    this.forms = document.querySelectorAll(this.formSelector);
    
    if (!this.forms.length) return;
    
    this.init();
  }
  
  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(form);
      });
    });
  }
  
  handleSubmit(form) {
    const emailInput = form.querySelector(this.inputSelector);
    const submitButton = form.querySelector(this.submitButtonSelector);
    
    if (!emailInput || !submitButton) return;
    
    const email = emailInput.value.trim();
    
    if (!this.validateEmail(email)) {
      this.showError(form, 'Please enter a valid email address.');
      return;
    }
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    
    // Submit form via AJAX
    const formData = new FormData(form);
    
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.showSuccess(form, data.message || 'Thank you for subscribing!');
        form.reset();
      } else {
        this.showError(form, data.message || 'Something went wrong. Please try again.');
      }
    })
    .catch(error => {
      this.showError(form, 'An error occurred. Please try again later.');
      console.error('Error:', error);
    })
    .finally(() => {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.innerHTML = 'Subscribe';
    });
  }
  
  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  showSuccess(form, message) {
    let successMessage = form.querySelector(this.successMessageSelector);
    
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.style.cssText = `
        color: #28a745;
        margin-top: 10px;
        padding: 10px;
        background-color: rgba(40, 167, 69, 0.1);
        border-radius: 4px;
      `;
      form.appendChild(successMessage);
    }
    
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    // Hide error message if exists
    const errorMessage = form.querySelector(this.errorMessageSelector);
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }
  
  showError(form, message) {
    let errorMessage = form.querySelector(this.errorMessageSelector);
    
    if (!errorMessage) {
      errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.style.cssText = `
        color: #dc3545;
        margin-top: 10px;
        padding: 10px;
        background-color: rgba(220, 53, 69, 0.1);
        border-radius: 4px;
      `;
      form.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Hide success message if exists
    const successMessage = form.querySelector(this.successMessageSelector);
    if (successMessage) {
      successMessage.style.display = 'none';
    }
  }
}

// Usage:
document.addEventListener('DOMContentLoaded', () => {
  const newsletterSubscription = new NewsletterSubscription();
});
```

## Application Entry Point

```javascript
// js/application.js

import { TestimonialSlider } from './components/testimonial_slider';
import { FormValidator } from './components/form_validation';
import { FAQAccordion } from './components/faq_accordion';
import { FileUploadHandler } from './components/file_upload';
import { MobileNavigation } from './components/mobile_navigation';
import { ReadingProgress } from './components/reading_progress';
import { ScrollAnimations } from './components/scroll_animations';
import { ServiceSelector } from './components/service_selector';
import { StickyHeader } from './components/sticky_header';
import { NewsletterSubscription } from './components/newsletter_subscription';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  new TestimonialSlider();
  new FormValidator('form');
  new FAQAccordion();
  new FileUploadHandler();
  new MobileNavigation();
  new ReadingProgress();
  new ScrollAnimations();
  new ServiceSelector();
  new StickyHeader();
  new NewsletterSubscription();
});
```

These JavaScript components provide a solid foundation for enhancing the user experience on the Messeri & Associates website. You can integrate them into your Rails application using Webpack or esbuild, depending on your Rails version and configuration.

In your Rails application, you would import and initialize these components in your main JavaScript file:

```javascript
// app/javascript/application.js

import { TestimonialSlider } from './components/testimonial_slider';
import { FormValidator } from './components/form_validation';
import { FAQAccordion } from './components/faq_accordion';
import { FileUploadHandler } from './components/file_upload';
import { MobileNavigation } from './components/mobile_navigation';
import { ReadingProgress } from './components/reading_progress';
import { ScrollAnimations } from './components/scroll_animations';
import { ServiceSelector } from './components/service_selector';
import { StickyHeader } from './components/sticky_header';
import { NewsletterSubscription } from './components/newsletter_subscription';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  new TestimonialSlider();
  new FormValidator('#contactForm');
  new FormValidator('#claimForm');
  new FAQAccordion();
  new FileUploadHandler({
    dropAreaSelector: '#photoDropArea',
    fileInputSelector: '#photoUpload',
    fileListSelector: '#photoList',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
  });
  new MobileNavigation();
  
  // Initialize only on specific pages
  if (document.querySelector('.blog-post-content')) {
    new ReadingProgress();
  }
  
  new ScrollAnimations();
  new StickyHeader();
  new NewsletterSubscription();
});
```

With these JavaScript components, your Messeri & Associates website will have a smooth, interactive user experience that enhances the professional image of the business.