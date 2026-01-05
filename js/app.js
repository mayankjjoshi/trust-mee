/**
 * TRUST MEE - Modern Electrical Services Website
 * Main JavaScript Application
 * Version: 2.0.0
 */

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    phone: '+916351802009',
    phoneDisplay: '6351802009',
    whatsappMessage: 'Hi! I need electrical services. Please help.',
    businessHours: {
        start: 9,
        end: 18.5,
        days: [1, 2, 3, 4, 5, 6] // Monday to Saturday
    },
    scrollThreshold: 100,
    animationThreshold: 0.1
};

// ========================================
// DOM ELEMENTS
// ========================================
const DOM = {
    header: document.getElementById('header'),
    navToggle: document.getElementById('navToggle'),
    navClose: document.getElementById('navClose'),
    navMobile: document.getElementById('navMobile'),
    navBackdrop: document.getElementById('navBackdrop'),
    navLinks: document.querySelectorAll('.nav-link, .nav-mobile-link'),
    backToTop: document.getElementById('backToTop'),
    contactForm: document.getElementById('contactForm'),
    callbackForm: document.getElementById('callbackForm'),
    quoteForm: document.getElementById('quoteForm'),
    modal: document.getElementById('callbackModal'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalClose: document.getElementById('modalClose'),
    openModalBtns: document.querySelectorAll('[data-modal="callback"]')
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    // Debounce function for performance
    debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
            rect.bottom >= 0
        );
    },

    // Format phone number for tel: link
    formatPhoneLink(phone) {
        return `tel:${phone.replace(/\s/g, '')}`;
    },

    // Format WhatsApp link
    formatWhatsAppLink(phone, message) {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    },

    // Check if business is open
    isBusinessOpen() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours() + now.getMinutes() / 60;

        return CONFIG.businessHours.days.includes(day) &&
               hour >= CONFIG.businessHours.start &&
               hour < CONFIG.businessHours.end;
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Validate email
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Validate phone (Indian format)
    isValidPhone(phone) {
        return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
    },

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add toast styles if not exists
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 1.5rem;
                    background: var(--gray-900);
                    color: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    z-index: 9999;
                    animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s;
                }
                .toast-success i { color: #10b981; }
                .toast-error i { color: #ef4444; }
                .toast-info i { color: #3b82f6; }
                @keyframes toastIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes toastOut {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

// ========================================
// NAVIGATION MODULE
// ========================================
const Navigation = {
    init() {
        this.bindEvents();
        this.setActiveLink();
    },

    bindEvents() {
        // Mobile menu toggle
        if (DOM.navToggle) {
            DOM.navToggle.addEventListener('click', () => this.openMobileMenu());
        }

        // Mobile menu close
        if (DOM.navClose) {
            DOM.navClose.addEventListener('click', () => this.closeMobileMenu());
        }

        // Backdrop click
        if (DOM.navBackdrop) {
            DOM.navBackdrop.addEventListener('click', () => this.closeMobileMenu());
        }

        // Close menu on link click
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMobileMenu();
        });

        // Update active link on scroll
        window.addEventListener('scroll', Utils.throttle(() => this.setActiveLink(), 100));
    },

    openMobileMenu() {
        if (DOM.navMobile) {
            DOM.navMobile.classList.add('active');
            DOM.navBackdrop?.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeMobileMenu() {
        if (DOM.navMobile) {
            DOM.navMobile.classList.remove('active');
            DOM.navBackdrop?.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            const links = document.querySelectorAll(`.nav-link[href*="${sectionId}"], .nav-mobile-link[href*="${sectionId}"]`);

            links.forEach(link => {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    }
};

// ========================================
// HEADER MODULE
// ========================================
const Header = {
    init() {
        this.bindEvents();
        this.checkScroll();
    },

    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => this.checkScroll(), 50));
    },

    checkScroll() {
        if (!DOM.header) return;

        if (window.pageYOffset > CONFIG.scrollThreshold) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
    }
};

// ========================================
// BACK TO TOP MODULE
// ========================================
const BackToTop = {
    init() {
        this.bindEvents();
        this.checkVisibility();
    },

    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => this.checkVisibility(), 100));

        if (DOM.backToTop) {
            DOM.backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    },

    checkVisibility() {
        if (!DOM.backToTop) return;

        if (window.pageYOffset > 500) {
            DOM.backToTop.classList.add('visible');
        } else {
            DOM.backToTop.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// ========================================
// SMOOTH SCROLL MODULE
// ========================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = DOM.header?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ========================================
// ANIMATION MODULE
// ========================================
const Animation = {
    init() {
        this.setupObserver();
        this.observeElements();
    },

    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: CONFIG.animationThreshold
            }
        );
    },

    observeElements() {
        const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
        elements.forEach(el => this.observer.observe(el));
    }
};

// ========================================
// MODAL MODULE
// ========================================
const Modal = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Open modal buttons
        DOM.openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        // Close modal
        if (DOM.modalClose) {
            DOM.modalClose.addEventListener('click', () => this.close());
        }

        // Backdrop click
        if (DOM.modalBackdrop) {
            DOM.modalBackdrop.addEventListener('click', () => this.close());
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    open() {
        if (DOM.modal && DOM.modalBackdrop) {
            DOM.modal.classList.add('active');
            DOM.modalBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close() {
        if (DOM.modal && DOM.modalBackdrop) {
            DOM.modal.classList.remove('active');
            DOM.modalBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// ========================================
// FORM MODULE
// ========================================
const Form = {
    init() {
        this.bindEvents();
        this.setupPhoneInputs();
    },

    bindEvents() {
        // Contact Form
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', (e) => this.handleSubmit(e, 'contact'));
        }

        // Callback Form
        if (DOM.callbackForm) {
            DOM.callbackForm.addEventListener('submit', (e) => this.handleSubmit(e, 'callback'));
        }

        // Quote Form
        if (DOM.quoteForm) {
            DOM.quoteForm.addEventListener('submit', (e) => this.handleSubmit(e, 'quote'));
        }
    },

    setupPhoneInputs() {
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', function() {
                // Remove non-numeric characters except +
                this.value = this.value.replace(/[^0-9+\-\s]/g, '');
            });
        });
    },

    async handleSubmit(e, formType) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {
                id: Utils.generateId(),
                type: formType,
                timestamp: new Date().toISOString(),
                ...Object.fromEntries(formData)
            };

            // Store in localStorage as backup
            this.storeLocally(data);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success
            this.showSuccess(form, formType);

            // Reset form
            form.reset();

            // Close modal if callback form
            if (formType === 'callback') {
                setTimeout(() => Modal.close(), 2000);
            }

            Utils.showToast('Message sent successfully! We\'ll contact you soon.', 'success');

        } catch (error) {
            console.error('Form submission error:', error);
            Utils.showToast('Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    },

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                this.showError(input, 'This field is required');
            } else if (input.type === 'email' && !Utils.isValidEmail(input.value)) {
                isValid = false;
                this.showError(input, 'Please enter a valid email');
            } else if (input.type === 'tel' && !Utils.isValidPhone(input.value)) {
                isValid = false;
                this.showError(input, 'Please enter a valid 10-digit phone number');
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    },

    showError(input, message) {
        input.style.borderColor = 'var(--error)';

        let errorEl = input.parentElement.querySelector('.form-error');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            errorEl.style.cssText = 'color: var(--error); font-size: 0.75rem; margin-top: 0.25rem; display: block;';
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
    },

    clearError(input) {
        input.style.borderColor = '';
        const errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.remove();
    },

    showSuccess(form, formType) {
        const wrapper = form.closest('.contact-form-wrapper');
        const successEl = wrapper?.querySelector('.form-success');

        if (successEl) {
            form.style.display = 'none';
            successEl.classList.add('active');

            setTimeout(() => {
                form.style.display = '';
                successEl.classList.remove('active');
            }, 5000);
        }
    },

    storeLocally(data) {
        const key = 'trustmee_leads';
        const leads = JSON.parse(localStorage.getItem(key) || '[]');
        leads.push(data);
        localStorage.setItem(key, JSON.stringify(leads));
    }
};

// ========================================
// COUNTER ANIMATION MODULE
// ========================================
const Counter = {
    init() {
        this.setupObserver();
    },

    setupObserver() {
        const counters = document.querySelectorAll('[data-counter]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }
};

// ========================================
// GALLERY MODULE
// ========================================
const Gallery = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img')?.src;
                const title = item.querySelector('.gallery-item-title')?.textContent;
                if (imgSrc) this.openLightbox(imgSrc, title);
            });
        });
    },

    openLightbox(src, title = '') {
        // Create lightbox if not exists
        let lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-backdrop"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="" alt="">
                    <p class="lightbox-title"></p>
                </div>
            `;

            // Add lightbox styles
            const style = document.createElement('style');
            style.textContent = `
                #lightbox {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: none;
                }
                #lightbox.active { display: block; }
                .lightbox-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.9);
                }
                .lightbox-content {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 2rem;
                }
                .lightbox-content img {
                    max-width: 90%;
                    max-height: 80vh;
                    border-radius: 0.5rem;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }
                .lightbox-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    color: #333;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.25rem;
                }
                .lightbox-title {
                    color: white;
                    margin-top: 1rem;
                    font-size: 1rem;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(lightbox);

            // Bind close events
            lightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => this.closeLightbox());
            lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeLightbox();
            });
        }

        lightbox.querySelector('img').src = src;
        lightbox.querySelector('.lightbox-title').textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// ========================================
// SERVICE FILTER MODULE (for Services page)
// ========================================
const ServiceFilter = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterServices(filter);

                // Update active state
                document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },

    filterServices(filter) {
        const cards = document.querySelectorAll('.service-card[data-category]');

        cards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = '';
                card.classList.add('fade-in', 'visible');
            } else {
                card.style.display = 'none';
            }
        });
    }
};

// ========================================
// CURRENT YEAR MODULE
// ========================================
const CurrentYear = {
    init() {
        const yearElements = document.querySelectorAll('[data-year]');
        const currentYear = new Date().getFullYear();

        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
};

// ========================================
// SHOWCASE SLIDER MODULE - UNIQUE DESIGN
// ========================================
const HeroSlider = {
    currentSlide: 0,
    slides: null,
    dots: null,
    autoSlideInterval: null,
    autoSlideDelay: 4000, // 4 seconds

    init() {
        this.slides = document.querySelectorAll('.showcase-slide');
        this.dots = document.querySelectorAll('.showcase-dot');
        const prevBtn = document.querySelector('.prev-arrow');
        const nextBtn = document.querySelector('.next-arrow');

        if (!this.slides.length) return;

        // Arrow click events
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetDotProgress();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetDotProgress();
            });
        }

        // Dot click events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetDotProgress();
            });
        });

        // Start auto-slide
        this.startAutoSlide();

        // Pause on hover
        const slider = document.querySelector('.showcase-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                this.stopAutoSlide();
                this.pauseDotProgress();
            });
            slider.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
    },

    goToSlide(index) {
        // Remove active from current
        this.slides[this.currentSlide].classList.remove('active');
        if (this.dots && this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.remove('active');
        }

        // Update index
        this.currentSlide = index;
        if (this.currentSlide >= this.slides.length) this.currentSlide = 0;
        if (this.currentSlide < 0) this.currentSlide = this.slides.length - 1;

        // Add active to new
        this.slides[this.currentSlide].classList.add('active');
        if (this.dots && this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.add('active');
        }
    },

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },

    resetDotProgress() {
        // Reset all dot progress animations (if dots exist)
        if (this.dots && this.dots.length) {
            this.dots.forEach(dot => {
                const progress = dot.querySelector('.dot-progress');
                if (progress) {
                    progress.style.animation = 'none';
                    progress.offsetHeight; // Trigger reflow
                }
            });
            // Start animation on active dot
            const activeDot = this.dots[this.currentSlide];
            if (activeDot) {
                const progress = activeDot.querySelector('.dot-progress');
                if (progress) {
                    progress.style.animation = 'dotProgress 4s linear forwards';
                }
            }
        }
    },

    pauseDotProgress() {
        if (this.dots && this.dots.length) {
            const activeDot = this.dots[this.currentSlide];
            if (activeDot) {
                const progress = activeDot.querySelector('.dot-progress');
                if (progress) {
                    progress.style.animationPlayState = 'paused';
                }
            }
        }
    },

    startAutoSlide() {
        this.stopAutoSlide();
        this.resetDotProgress();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
            this.resetDotProgress();
        }, this.autoSlideDelay);
    },

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }
};

// ========================================
// INITIALIZE APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Core modules
    Navigation.init();
    Header.init();
    BackToTop.init();
    SmoothScroll.init();
    Animation.init();
    Modal.init();
    Form.init();
    Counter.init();
    Gallery.init();
    ServiceFilter.init();
    CurrentYear.init();
    HeroSlider.init();

    // Log initialization
    console.log('TRUST MEE website initialized successfully!');
    console.log(`Business hours: ${Utils.isBusinessOpen() ? 'OPEN' : 'CLOSED'}`);
});

// ========================================
// EXPORT FOR MODULE USE
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, Navigation, Header, Form, Modal, Gallery };
}
