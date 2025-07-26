/**
 * =================================
 * INTERACTION HANDLERS
 * =================================
 */

class InteractionManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupLikeButtons();
        this.setupMagneticEffect();
        this.setupRippleEffect();
        this.setupTooltips();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        const submitButton = document.getElementById('submit-button');
        
        if (!contactForm || !submitButton) return;

        // Initialize Mo.js burst effect
        let burst = null;
        if (typeof mojs !== 'undefined') {
            burst = new mojs.Burst({
                parent: submitButton,
                radius: { 50: 150 },
                count: 12,
                children: {
                    shape: ['circle', 'polygon'],
                    fill: ['#3B82F6', '#8B5CF6', '#EC4899'],
                    angle: { 0: 180 },
                    degree: 360,
                    duration: 700,
                    easing: 'ease.out'
                }
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!this.validateForm(data)) return;
            
            // Play burst animation
            if (burst) burst.play();
            
            // Update button state
            const buttonText = submitButton.querySelector('.button-text');
            const originalText = buttonText.innerHTML;
            
            submitButton.disabled = true;
            buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Simulate form submission
                await this.simulateFormSubmission(data);
                
                // Success state
                buttonText.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                contactForm.reset();
                this.showNotification('Message sent successfully!', 'success');
                
                setTimeout(() => {
                    buttonText.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
                
            } catch (error) {
                // Error state
                buttonText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
                this.showNotification('Failed to send message. Please try again.', 'error');
                
                setTimeout(() => {
                    buttonText.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateForm(data) {
        let isValid = true;
        const errors = {};

        if (!data.name || data.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
            isValid = false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long';
            isValid = false;
        }

        // Display errors
        Object.keys(errors).forEach(field => {
            this.showFieldError(field, errors[field]);
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let error = '';

        switch (name) {
            case 'name':
                if (value.length < 2) error = 'Name must be at least 2 characters long';
                break;
            case 'email':
                if (!this.isValidEmail(value)) error = 'Please enter a valid email address';
                break;
            case 'message':
                if (value.length < 10) error = 'Message must be at least 10 characters long';
                break;
        }

        if (error) {
            this.showFieldError(name, error);
        } else {
            this.clearFieldError(field);
        }
    }

    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async simulateFormSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
            console.log('Form submitted:', data);
            return Promise.resolve();
        } else {
            throw new Error('Submission failed');
        }
    }

    setupLikeButtons() {
        document.querySelectorAll('.like-button').forEach(button => {
            let burst = null;
            
            // Initialize Mo.js burst effect
            if (typeof mojs !== 'undefined') {
                burst = new mojs.Burst({
                    parent: button,
                    radius: { 20: 60 },
                    count: 8,
                    children: {
                        shape: 'polygon',
                        fill: '#EC4899',
                        radius: { 7: 0 },
                        angle: { 0: 180 },
                        duration: 1000,
                        easing: 'ease.out'
                    }
                });
            }
            
            button.addEventListener('click', function() {
                const isLiked = this.classList.contains('active');
                
                if (!isLiked) {
                    this.classList.add('active');
                    if (burst) burst.play();
                    
                    // Haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                } else {
                    this.classList.remove('active');
                }
                
                // Add pulse animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    setupMagneticEffect() {
        const magneticElements = document.querySelectorAll('.btn-primary, .social-link');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    setupRippleEffect() {
        const rippleElements = document.querySelectorAll('.btn, .card, .skill-icon');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            let tooltip = null;
            
            element.addEventListener('mouseenter', () => {
                const text = element.getAttribute('data-tooltip');
                
                tooltip = document.createElement('div');
                tooltip.className = 'tooltip-popup';
                tooltip.textContent = text;
                document.body.appendChild(tooltip);
                
                this.positionTooltip(tooltip, element);
            });
            
            element.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            });
            
            element.addEventListener('mousemove', (e) => {
                if (tooltip) {
                    this.positionTooltip(tooltip, element, e);
                }
            });
        });
    }

    positionTooltip(tooltip, element, mouseEvent = null) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left, top;
        
        if (mouseEvent) {
            left = mouseEvent.clientX - tooltipRect.width / 2;
            top = mouseEvent.clientY - tooltipRect.height - 10;
        } else {
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            top = rect.top - tooltipRect.height - 10;
        }
        
        // Keep tooltip in viewport
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        top = Math.max(10, top);
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const themeToggle = document.getElementById('theme-toggle');
                if (themeToggle) themeToggle.click();
            }
            
            // Escape to close modals/menus
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Enhance focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Announce dynamic content changes to screen readers
        this.setupLiveRegion();
    }

    setupLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        const timer = setTimeout(() => this.removeNotification(notification), duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timer);
            this.removeNotification(notification);
        });
        
        // Announce to screen reader
        this.announceToScreenReader(message);
    }

    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    closeAllModals() {
        // Close mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close any other modals/overlays
        document.querySelectorAll('.modal, .overlay').forEach(modal => {
            modal.classList.remove('active', 'show');
        });
    }
}

// Initialize interaction manager
const interactionManager = new InteractionManager();
