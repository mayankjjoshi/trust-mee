/**
 * TRUST MEE - Electrical Services Website
 * Main JavaScript File
 */

// DOM Elements
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// ========================================
// MOBILE NAVIGATION
// ========================================

// Open Menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close Menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close Menu on Link Click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close Menu on Outside Click
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to Top Button
    if (currentScroll > 500) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }

    lastScroll = currentScroll;
});

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

const sections = document.querySelectorAll('section[id]');

function activeNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', activeNavLink);

// ========================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// CONTACT FORM HANDLING
// ========================================

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email') || 'Not provided',
            service: formData.get('service'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Option 1: Send to Google Sheets (Web App URL)
            // Uncomment and add your Google Sheets Web App URL
            /*
            const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_SHEET_WEB_APP_URL';
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            */

            // Option 2: Send via WhatsApp (Default fallback)
            const whatsappMessage = `*New Lead from Website*%0A%0A` +
                `*Name:* ${data.name}%0A` +
                `*Phone:* ${data.phone}%0A` +
                `*Email:* ${data.email}%0A` +
                `*Service:* ${data.service}%0A` +
                `*Message:* ${data.message}`;

            // Store in localStorage for backup
            const leads = JSON.parse(localStorage.getItem('trustmee_leads') || '[]');
            leads.push(data);
            localStorage.setItem('trustmee_leads', JSON.stringify(leads));

            // Simulate API delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Open WhatsApp with form data (optional - can be removed if using Google Sheets)
            // window.open(`https://wa.me/916351802009?text=${whatsappMessage}`, '_blank');

            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                formSuccess.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting the form. Please try calling us directly.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========================================
// FORM VALIDATION
// ========================================

// Phone number validation
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        // Remove non-numeric characters
        this.value = this.value.replace(/[^0-9+\-\s]/g, '');
    });
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .why-card, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Add CSS for animated elements
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ========================================
// SERVICE WORKER REGISTRATION (PWA Ready)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ========================================
// GOOGLE SHEETS INTEGRATION SETUP
// ========================================

/*
 * To integrate with Google Sheets:
 *
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code:
 *
 * function doPost(e) {
 *   const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   const data = JSON.parse(e.postData.contents);
 *
 *   sheet.appendRow([
 *     new Date(),
 *     data.name,
 *     data.phone,
 *     data.email,
 *     data.service,
 *     data.message
 *   ]);
 *
 *   return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 *
 * 4. Deploy > New deployment > Web app
 * 5. Set "Execute as" to "Me" and "Who has access" to "Anyone"
 * 6. Copy the Web app URL and paste it in GOOGLE_SHEET_URL above
 */

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if there are any stored leads (for debugging)
    const storedLeads = localStorage.getItem('trustmee_leads');
    if (storedLeads) {
        console.log('Stored leads:', JSON.parse(storedLeads).length);
    }

    // Add current year to footer copyright
    const copyrightYear = document.querySelector('.footer-bottom p');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2024', currentYear);
    }
});

console.log('TRUST MEE website loaded successfully!');
