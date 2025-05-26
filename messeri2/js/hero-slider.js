class HeroSlider {
    constructor() {
        this.slides = [
            'img/hero-1.jpg',
            'img/hero-2.jpg',
            'img/hero-3.jpg'
        ];
        this.currentSlide = 0;
        this.sliderContainer = document.querySelector('.hero-slider');
        this.init();
    }

    init() {
        // Create slide elements
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            slideElement.style.backgroundImage = `url(${slide})`;
            this.sliderContainer.appendChild(slideElement);
        });

        // Start slideshow
        this.startSlideshow();
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
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
}); 