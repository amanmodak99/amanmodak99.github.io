/**
 * Advanced Effects Controller
 * Handles particle system, cursor effects, scroll progress, and advanced animations
 */

class AdvancedEffects {
    constructor() {
        this.particles = [];
        this.cursorTrail = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!this.isReducedMotion) {
            this.init();
        }
    }

    init() {
        this.createParticleSystem();
        this.setupCursorTrail();
        this.setupScrollProgress();
        this.setupFloatingActions();
        this.setupMagneticElements();
        this.setupTextAnimations();
        this.setupParallaxEffects();
    }

    // Particle System
    createParticleSystem() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles-bg';
        document.body.appendChild(particleContainer);

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle(particleContainer);
            }, i * 200);
        }

        // Continuously create particles
        setInterval(() => {
            if (this.particles.length < 50) {
                this.createParticle(particleContainer);
            }
        }, 2000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        this.particles.push(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particles = this.particles.filter(p => p !== particle);
            }
        }, 25000);
    }

    // Cursor Trail Effect
    setupCursorTrail() {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);

        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateTrail = () => {
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';
            
            requestAnimationFrame(animateTrail);
        };
        
        animateTrail();
    }

    // Scroll Progress Indicator
    setupScrollProgress() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);

        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Floating Action Buttons
    setupFloatingActions() {
        const floatingActions = document.createElement('div');
        floatingActions.className = 'floating-actions';
        
        // Back to top button
        const backToTop = this.createFloatingButton('fas fa-arrow-up', 'Back to top');
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Theme toggle (duplicate for easy access)
        const themeToggle = this.createFloatingButton('fas fa-palette', 'Toggle theme');
        themeToggle.addEventListener('click', () => {
            document.getElementById('theme-toggle').click();
        });
        
        floatingActions.appendChild(backToTop);
        floatingActions.appendChild(themeToggle);
        document.body.appendChild(floatingActions);

        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                floatingActions.style.display = 'flex';
            } else {
                floatingActions.style.display = 'none';
            }
        });
    }

    createFloatingButton(iconClass, title) {
        const button = document.createElement('button');
        button.className = 'floating-btn';
        button.title = title;
        button.innerHTML = `<i class="${iconClass}"></i>`;
        return button;
    }

    // Magnetic Effect for Interactive Elements
    setupMagneticElements() {
        const magneticElements = document.querySelectorAll('.btn, .social-link, .skill-icon');
        
        magneticElements.forEach(element => {
            element.classList.add('magnetic');
            
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
            });

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `scale(1.1) translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
        });
    }

    // Enhanced Text Animations
    setupTextAnimations() {
        // Split text into spans for character animation
        const animatedTexts = document.querySelectorAll('.hero-title .line');
        
        animatedTexts.forEach((line, lineIndex) => {
            const text = line.textContent;
            line.innerHTML = '';
            
            [...text].forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.setProperty('--i', charIndex);
                span.style.animationDelay = `${(lineIndex * 0.5) + (charIndex * 0.05)}s`;
                line.appendChild(span);
            });
        });

        // Add typewriter effect to dynamic text
        const typedElement = document.getElementById('typed-element');
        if (typedElement && window.Typed) {
            new window.Typed('#typed-element', {
                strings: [
                    'Software Developer',
                    'Tech Enthusiast',
                    'Problem Solver',
                    'Innovation Leader',
                    'Full Stack Developer'
                ],
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // Parallax Effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-image-container, .about-image-container');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${parallax}px)`;
            });
        });
    }

    // Advanced Scroll Animations
    setupAdvancedScrollAnimations() {
        if (window.ScrollReveal) {
            // Enhanced ScrollReveal configuration
            window.ScrollReveal().reveal('.stagger-item', {
                delay: 200,
                distance: '50px',
                duration: 800,
                easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
                interval: 100,
                origin: 'bottom',
                viewFactor: 0.2
            });

            // Reveal sections with different effects
            window.ScrollReveal().reveal('.about', {
                delay: 300,
                distance: '100px',
                duration: 1000,
                origin: 'left'
            });

            window.ScrollReveal().reveal('.experience', {
                delay: 300,
                distance: '100px',
                duration: 1000,
                origin: 'right'
            });

            window.ScrollReveal().reveal('.skills', {
                delay: 300,
                distance: '100px',
                duration: 1000,
                origin: 'bottom'
            });
        }
    }

    // Counter Animation
    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toString().padStart(2, '0') + '+';
                }
            }, 16);
        };

        // Intersection Observer for counters
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // Glitch Effect for Special Elements
    addGlitchEffect(element, text) {
        element.classList.add('glitch');
        element.setAttribute('data-text', text);
        
        // Trigger glitch randomly
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.style.animation = 'none';
                element.offsetHeight; // Trigger reflow
                element.style.animation = 'glitch 0.3s';
            }
        }, 1000);
    }

    // Neon Glow Effect
    addNeonGlow(elements) {
        elements.forEach(element => {
            element.classList.add('neon-glow');
        });
    }

    // Initialize all effects when DOM is ready
    static init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new AdvancedEffects();
            });
        } else {
            new AdvancedEffects();
        }
    }
}

// Enhanced Page Transitions
class PageTransitions {
    constructor() {
        this.setupPageTransitions();
    }

    setupPageTransitions() {
        // Add page transition overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
            pointer-events: none;
        `;
        overlay.id = 'page-transition-overlay';
        document.body.appendChild(overlay);

        // Handle navigation links
        document.querySelectorAll('a[href^="./"], a[href^="../"], a[href^="/"], a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.includes('mailto:') && !href.includes('tel:')) {
                    e.preventDefault();
                    this.animatePageTransition(href);
                }
            });
        });
    }

    animatePageTransition(href) {
        const overlay = document.getElementById('page-transition-overlay');
        overlay.style.transform = 'scaleX(1)';
        
        setTimeout(() => {
            window.location.href = href;
        }, 600);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.setupPerformanceMonitoring();
    }

    setupPerformanceMonitoring() {
        // Monitor frame rate
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Adjust animations based on performance
                if (fps < 30) {
                    this.reduceAnimations();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    reduceAnimations() {
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.remove();
            }
        });
        
        // Disable cursor trail on low performance
        const cursorTrail = document.querySelector('.cursor-trail');
        if (cursorTrail) {
            cursorTrail.style.display = 'none';
        }
    }
}

// Initialize all advanced effects
AdvancedEffects.init();

// Initialize page transitions and performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    new PageTransitions();
    new PerformanceMonitor();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedEffects, PageTransitions, PerformanceMonitor };
}
