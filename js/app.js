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
    throttle(func, limit = 150) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
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
        const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:0.5rem;padding:1rem 1.5rem;background:#212121;color:#fff;border-radius:0.75rem;box-shadow:0 10px 25px rgba(0,0,0,0.2);z-index:9999`;
        toast.innerHTML = `<span style="color:${colors[type]}">●</span> ${message}`;
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
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        // Submit via AJAX to Web3Forms
        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                form.reset();
                Utils.showToast('Message sent successfully! We will contact you soon.', 'success');
                this.showSuccess(form, formType);
            } else {
                Utils.showToast('Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            Utils.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Restore button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
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
        this.bindFilterEvents();
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

    bindFilterEvents() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!filterBtns.length || !galleryItems.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                const filter = btn.getAttribute('data-filter');
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    },

    openLightbox(src, title = '') {
        let lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.style.cssText = 'position:fixed;inset:0;z-index:9999;display:none;background:rgba(0,0,0,0.9)';
            lightbox.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:2rem">
                    <button style="position:absolute;top:1rem;right:1rem;width:44px;height:44px;background:#fff;border:none;border-radius:50%;cursor:pointer;font-size:1.25rem" aria-label="Close">&times;</button>
                    <img src="" alt="" style="max-width:90%;max-height:80vh;border-radius:0.5rem">
                    <p style="color:#fff;margin-top:1rem"></p>
                </div>
            `;
            document.body.appendChild(lightbox);
            lightbox.querySelector('button').onclick = () => this.closeLightbox();
            lightbox.onclick = (e) => { if (e.target === lightbox) this.closeLightbox(); };
        }
        lightbox.querySelector('img').src = src;
        lightbox.querySelector('p').textContent = title;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
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
// URBAN COMPANY SEARCH FUNCTIONALITY (Lazy loaded)
// ========================================
const UCSearch = {
    init() {
        const searchInput = document.getElementById('heroSearch');
        if (!searchInput) return;

        // Only initialize when user interacts
        searchInput.addEventListener('focus', () => this.setup(), { once: true });
    },

    setup() {
        const searchInput = document.getElementById('heroSearch');
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!searchInput || !suggestionsContainer) return;

        const services = [
            { name: 'House Wiring', icon: 'fa-plug' },
            { name: 'MCB Installation', icon: 'fa-shield-alt' },
            { name: 'AC Repair', icon: 'fa-snowflake' },
            { name: 'Washing Machine', icon: 'fa-tshirt' }
        ];

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const results = query ? services.filter(s => s.name.toLowerCase().includes(query)) : services;
            suggestionsContainer.innerHTML = results.slice(0, 4).map(s =>
                `<a href="services.html" class="uc-suggestion-item"><i class="fas ${s.icon}"></i><span>${s.name}</span></a>`
            ).join('');
        });
    }
};

// ========================================
// URBAN COMPANY APPLIANCE SLIDER
// ========================================
const UCApplianceSlider = {
    sliders: [],
    scrollAmount: 300,

    init() {
        // Find all slider sections
        const sections = document.querySelectorAll('.uc-appliance-section');

        sections.forEach((section, index) => {
            const track = section.querySelector('.uc-appliance-track');
            const prevBtn = section.querySelector('.uc-slider-prev');
            const nextBtn = section.querySelector('.uc-slider-next');

            if (!track) return;

            const slider = { track, prevBtn, nextBtn };
            this.sliders.push(slider);

            this.bindSliderEvents(slider);
            this.updateSliderButtonStates(slider);
        });
    },

    bindSliderEvents(slider) {
        if (slider.prevBtn) {
            slider.prevBtn.addEventListener('click', () => this.scrollPrev(slider));
        }

        if (slider.nextBtn) {
            slider.nextBtn.addEventListener('click', () => this.scrollNext(slider));
        }

        // Update button states on scroll
        slider.track.addEventListener('scroll', Utils.debounce(() => {
            this.updateSliderButtonStates(slider);
        }, 100));
    },

    scrollPrev(slider) {
        slider.track.scrollBy({
            left: -this.scrollAmount,
            behavior: 'smooth'
        });
    },

    scrollNext(slider) {
        slider.track.scrollBy({
            left: this.scrollAmount,
            behavior: 'smooth'
        });
    },

    updateSliderButtonStates(slider) {
        if (!slider.track) return;

        const scrollLeft = slider.track.scrollLeft;
        const maxScroll = slider.track.scrollWidth - slider.track.clientWidth;

        // Hide buttons completely if no scrolling needed
        if (maxScroll <= 0) {
            if (slider.prevBtn) slider.prevBtn.style.display = 'none';
            if (slider.nextBtn) slider.nextBtn.style.display = 'none';
            return;
        } else {
            if (slider.prevBtn) slider.prevBtn.style.display = 'flex';
            if (slider.nextBtn) slider.nextBtn.style.display = 'flex';
        }

        // Hide/show prev button
        if (slider.prevBtn) {
            slider.prevBtn.style.opacity = scrollLeft <= 0 ? '0.3' : '1';
            slider.prevBtn.style.pointerEvents = scrollLeft <= 0 ? 'none' : 'auto';
        }

        // Hide/show next button
        if (slider.nextBtn) {
            slider.nextBtn.style.opacity = scrollLeft >= maxScroll - 1 ? '0.3' : '1';
            slider.nextBtn.style.pointerEvents = scrollLeft >= maxScroll - 1 ? 'none' : 'auto';
        }
    }
};

// ========================================
// INITIALIZE APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Critical modules (immediate)
    Header.init();
    CurrentYear.init();
    UCApplianceSlider.init();

    // Deferred modules (after first paint)
    requestAnimationFrame(() => {
        Navigation.init();
        BackToTop.init();
        SmoothScroll.init();
        Form.init();
    });

    // Non-critical modules (when idle)
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            Animation.init();
            Modal.init();
            Counter.init();
            Gallery.init();
            ServiceFilter.init();
            UCSearch.init();
        }, { timeout: 2000 });
    } else {
        setTimeout(() => {
            Animation.init();
            Modal.init();
            Counter.init();
            Gallery.init();
            ServiceFilter.init();
            UCSearch.init();
        }, 200);
    }
});
