/**
 * =================================
 * ANIMATION CONTROLLERS
 * =================================
 */

class AnimationController {
    constructor() {
        this.isInitialized = false;
        this.observers = new Map();
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupScrollReveal();
        this.setupTypedJS();
        this.setupAnimeJS();
        this.setupIntersectionObserver();
        this.setupParticles();
        this.setupCursor();
        this.setupScrollProgress();
        
        this.isInitialized = true;
    }

    setupScrollReveal() {
        if (typeof ScrollReveal === 'undefined') return;

        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '60px',
            duration: 1000,
            delay: 200,
            reset: false,
            easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
            opacity: 0,
            scale: 0.9,
            mobile: true,
            cleanup: true
        });

        // Reveal configurations
        const revealConfigs = [
            { selector: '.section-title, .page-title', config: { delay: 100 } },
            { selector: '.section-subtitle, .page-subtitle', config: { delay: 200 } },
            { selector: '.hero-subtitle, .hero-buttons', config: { delay: 300 } },
            { selector: '.hero-image-container', config: { origin: 'top', delay: 400 } },
            { selector: '.about-image-container', config: { origin: 'left', distance: '80px', delay: 200 } },
            { selector: '.about-text', config: { origin: 'right', distance: '80px', delay: 300 } },
            { selector: '.stat-item', config: { interval: 100, scale: 0.8 } },
            { selector: '.skill-icon', config: { interval: 150, scale: 0.8, distance: '40px' } },
            { selector: '.timeline-item', config: { interval: 200, origin: 'left' } },
            { selector: '.project-card', config: { interval: 200, scale: 0.9 } },
            { selector: '.certification-item', config: { interval: 150, distance: '30px' } },
            { selector: '.contact-info', config: { origin: 'left', delay: 200 } },
            { selector: '.contact-form', config: { origin: 'right', delay: 300 } }
        ];

        revealConfigs.forEach(({ selector, config }) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                sr.reveal(selector, config);
            }
        });
    }

    setupTypedJS() {
        const typedElement = document.getElementById('typed-element');
        if (!typedElement || typeof Typed === 'undefined') return;

        new Typed('#typed-element', {
            strings: [
                'Software Developer',
                'Tech Enthusiast', 
                'Creative Coder',
                'Problem Solver',
                'Innovation Driver'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            autoInsertCss: true,
            smartBackspace: true
        });
    }

    setupAnimeJS() {
        if (typeof anime === 'undefined') return;

        this.setupHeroTextAnimation();
        this.setupTimelineAnimation();
        this.setupSkillHoverAnimations();
        this.setupCounterAnimations();
    }

    setupHeroTextAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        // Wrap each character in spans
        const lines = heroTitle.querySelectorAll('.line');
        lines.forEach(line => {
            line.innerHTML = line.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        });

        // Animate letters
        anime.timeline({ loop: false })
            .add({
                targets: '.hero-title .letter',
                translateY: [100, 0],
                translateZ: 0,
                opacity: [0, 1],
                easing: "easeOutExpo",
                duration: 1400,
                delay: (el, i) => 500 + 30 * i
            });
    }

    setupTimelineAnimation() {
        const timeline = document.querySelector('.experience-timeline');
        if (!timeline) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: timeline,
                        '--scaleY': [0, 1],
                        duration: 1200,
                        easing: 'easeInOutSine',
                        update: (anim) => {
                            timeline.style.setProperty('--scaleY', anim.progress / 100);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(timeline);
    }

    setupSkillHoverAnimations() {
        document.querySelectorAll('.skill-icon').forEach(icon => {
            let animation = null;

            icon.addEventListener('mouseenter', () => {
                if (animation) animation.pause();
                
                animation = anime({
                    targets: icon,
                    translateY: [-10, 0],
                    scale: [1, 1.1, 1],
                    rotate: '1turn',
                    duration: 800,
                    easing: 'easeInOutSine'
                });
            });

            icon.addEventListener('mouseleave', () => {
                if (animation) {
                    anime({
                        targets: icon,
                        translateY: 0,
                        scale: 1,
                        rotate: '0turn',
                        duration: 400,
                        easing: 'easeOutSine'
                    });
                }
            });
        });
    }

    setupCounterAnimations() {
        const statNumbers = document.querySelectorAll('.stat-item h4');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    const suffix = text.replace(/[0-9]/g, '');
                    
                    if (number) {
                        anime({
                            targets: { value: 0 },
                            value: number,
                            duration: 2000,
                            easing: 'easeOutExpo',
                            update: function(anim) {
                                element.textContent = Math.floor(anim.animatables[0].target.value) + suffix;
                            }
                        });
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }

    setupParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-background';
        document.body.appendChild(particlesContainer);

        // Create floating particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    setupCursor() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.classList.add('visible');
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
        });

        // Smooth cursor movement
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .skill-icon, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class=\"scroll-progress-bar\"></div>';
        document.body.appendChild(progressBar);

        const progressBarFill = progressBar.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBarFill.style.transform = `scaleX(${scrollPercent / 100})`;
        });
    }

    // Utility method to add stagger animations
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add(animationClass);
            }, index * delay);
        });
    }

    // Clean up method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.isInitialized = false;
    }
}

// Initialize animation controller
const animationController = new AnimationController();
