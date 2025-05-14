class HeaderSlider {
    constructor() {
        this.slides = [
            'img/header-bg.jpg',
            'img/header-bg2.jpg',
            'img/header-bg3.jpg'
        ];
        this.currentSlide = 0;
        this.sliderContainer = document.querySelector('.header-slider');
        this.init();
    }

    init() {
        // Create slides
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `header-slide ${index === 0 ? 'active' : ''}`;
            slideElement.style.backgroundImage = `url('${slide}')`;
            this.sliderContainer.appendChild(slideElement);
        });

        // Start automatic slideshow
        this.startSlideshow();
    }

    startSlideshow() {
        setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    nextSlide() {
        const slides = document.querySelectorAll('.header-slide');
        slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        slides[this.currentSlide].classList.add('active');
    }
}

// Initialize the slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeaderSlider();
}); 