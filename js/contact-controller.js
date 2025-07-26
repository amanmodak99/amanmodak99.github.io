// Enhanced Contact Form Controller
class ContactController {
    constructor() {
        this.form = document.getElementById('enhanced-contact-form');
        this.statusElement = document.getElementById('form-status');
        this.submitButton = this.form?.querySelector('.submit-btn');
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupAnimations();
        this.setupValidation();
        this.loadContactStyles();
    }

    loadContactStyles() {
        if (!document.querySelector('link[href*="contact-enhanced.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/contact-enhanced.css';
            document.head.appendChild(link);
        }
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });

        // Enhanced interactions
        this.setupEnhancedInteractions();
    }

    setupEnhancedInteractions() {
        // Contact method hover effects
        document.querySelectorAll('.contact-method').forEach(method => {
            method.addEventListener('mouseenter', (e) => {
                e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
                this.playHoverSound();
            });
            
            method.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.transform = '';
            });
        });

        // Social link animations
        document.querySelectorAll('.social-link-enhanced').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
                this.playHoverSound();
            });
            
            link.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.transform = '';
            });
        });

        // Form field focus animations
        document.querySelectorAll('.form-control').forEach(field => {
            field.addEventListener('focus', (e) => {
                e.currentTarget.parentElement.style.transform = 'scale(1.02)';
                this.playFocusSound();
            });
            
            field.addEventListener('blur', (e) => {
                e.currentTarget.parentElement.style.transform = '';
            });
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    
                    // Stagger animations for contact methods
                    if (entry.target.classList.contains('contact-info')) {
                        this.animateContactMethods();
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.contact-animate-in').forEach(el => {
            observer.observe(el);
        });
    }

    animateContactMethods() {
        const methods = document.querySelectorAll('.contact-method');
        methods.forEach((method, index) => {
            setTimeout(() => {
                method.style.opacity = '0';
                method.style.transform = 'translateX(-20px)';
                method.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    method.style.opacity = '1';
                    method.style.transform = 'translateX(0)';
                }, 50);
            }, index * 100);
        });
    }

    setupValidation() {
        // Enhanced validation patterns
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid first name (letters only, min 2 characters)'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid last name (letters only, min 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                minLength: 5,
                message: 'Please enter a subject (minimum 5 characters)'
            },
            message: {
                required: true,
                minLength: 20,
                message: 'Please enter a message (minimum 20 characters)'
            }
        };
    }

    validateField(field) {
        const fieldName = field.name;
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        // Pattern validation
        else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }
        // Length validation
        else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    showFieldValidation(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        
        // Remove existing validation
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) existingError.remove();

        if (!isValid) {
            field.style.borderColor = '#f44336';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = `
                color: #f44336;
                font-size: 0.8rem;
                margin-top: 0.5rem;
                opacity: 0;
                transform: translateY(-5px);
                transition: all 0.3s ease;
            `;
            errorDiv.textContent = message;
            
            formGroup.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.style.opacity = '1';
                errorDiv.style.transform = 'translateY(0)';
            }, 50);
        } else {
            field.style.borderColor = '';
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.style.opacity = '0';
            setTimeout(() => existingError.remove(), 300);
        }
        field.style.borderColor = '';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const fields = this.form.querySelectorAll('.form-control');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showStatus('Please correct the errors above', 'error');
            this.playErrorSound();
            return;
        }

        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate form submission
            await this.submitForm();
            this.showStatus('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.', 'success');
            this.form.reset();
            this.playSuccessSound();
            
            // Add celebration animation
            this.triggerCelebration();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
            this.playErrorSound();
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                Math.random() > 0.1 ? resolve() : reject(new Error('Network error'));
            }, 2000);
        });
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<i class="fas fa-rocket"></i> Send Message';
        }
    }

    showStatus(message, type) {
        this.statusElement.textContent = message;
        this.statusElement.className = `form-status ${type} show`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.statusElement.classList.remove('show');
        }, 5000);
    }

    triggerCelebration() {
        // Create celebration particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createCelebrationParticle();
            }, i * 100);
        }
    }

    createCelebrationParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${Math.random() > 0.5 ? '#64ffda' : '#40e0ff'};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: celebrate 2s ease-out forwards;
        `;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 200;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--dx', dx + 'px');
        particle.style.setProperty('--dy', dy + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }

    // Audio feedback methods
    playHoverSound() {
        this.playTone(1000, 0.05, 'sine');
    }

    playFocusSound() {
        this.playTone(800, 0.1, 'sine');
    }

    playSuccessSound() {
        // Play success chord
        setTimeout(() => this.playTone(523, 0.2, 'sine'), 0);    // C
        setTimeout(() => this.playTone(659, 0.2, 'sine'), 100);  // E
        setTimeout(() => this.playTone(784, 0.2, 'sine'), 200);  // G
    }

    playErrorSound() {
        this.playTone(400, 0.3, 'sawtooth');
    }

    playTone(frequency, duration, type = 'sine') {
        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, window.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, window.audioContext.currentTime + duration);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + duration);
    }
}

// Add celebration animation CSS
const celebrationCSS = `
    @keyframes celebrate {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--dx), var(--dy)) scale(0);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = celebrationCSS;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactController = new ContactController();
    
    // Make it globally accessible
    window.contactController = contactController;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactController;
}
