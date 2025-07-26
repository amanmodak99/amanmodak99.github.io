// Enhanced Projects Page Controller
class ProjectsController {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupAnimations();
        this.initializeCounters();
    }

    init() {
        // Add enhanced projects stylesheet
        this.loadProjectsStyles();
        
        // Initialize filter system
        this.currentFilter = 'all';
        
        // Initialize intersection observer for animations
        this.observeElements();
        
        // Initialize 3D effects for project cards
        this.setup3DEffects();
    }

    loadProjectsStyles() {
        if (!document.querySelector('link[href*="projects-enhanced.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/projects-enhanced.css';
            document.head.appendChild(link);
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Project card interactions
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleCardHover(e));
            card.addEventListener('mouseleave', (e) => this.handleCardLeave(e));
            card.addEventListener('mousemove', (e) => this.handleCardMouseMove(e));
        });

        // Smooth scrolling for project links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Add ripple effect to buttons
        document.querySelectorAll('.btn, .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(e));
        });
    }

    handleFilter(e) {
        const button = e.currentTarget;
        const filter = button.dataset.filter;
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Filter projects
        this.filterProjects(filter);
        
        // Add audio feedback
        this.playFilterSound();
    }

    filterProjects(filter) {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            const categories = card.dataset.category?.split(' ') || [];
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                card.classList.remove('hide');
                card.classList.add('show');
                card.style.animationDelay = `${index * 0.1}s`;
            } else {
                card.classList.add('hide');
                card.classList.remove('show');
            }
        });
        
        // Update visible count
        this.updateProjectCount(filter);
    }

    updateProjectCount(filter) {
        const totalCards = document.querySelectorAll('.project-card').length;
        const visibleCards = document.querySelectorAll('.project-card.show').length;
        
        // You can add a counter display here if needed
        console.log(`Showing ${visibleCards} of ${totalCards} projects`);
    }

    handleCardHover(e) {
        const card = e.currentTarget;
        
        // Add glow effect
        card.style.boxShadow = '0 20px 50px rgba(100, 255, 218, 0.3)';
        
        // Trigger 3D rotation
        this.add3DRotation(card);
        
        // Play hover sound
        this.playHoverSound();
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        
        // Reset transformations
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    handleCardMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
    }

    add3DRotation(card) {
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateY(5deg) translateZ(20px)';
    }

    setupAnimations() {
        // Add stagger animation to project cards
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
        
        // Animate filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.05}s`;
            btn.classList.add('fade-in');
        });
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe project cards
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });

        // Observe stats
        document.querySelectorAll('.stat-number').forEach(stat => {
            observer.observe(stat);
        });
    }

    initializeCounters() {
        // Set up counter data
        const counters = [
            { element: '.stat-number[data-count="50000"]', target: 50000, suffix: 'K+' },
            { element: '.stat-number[data-count="10000"]', target: 10000, suffix: 'K+' },
            { element: '.stat-number[data-count="1000"]', target: 1000, suffix: 'K+' },
            { element: '.stat-number[data-count="98"]', target: 98, suffix: '%' }
        ];

        counters.forEach(counter => {
            const element = document.querySelector(counter.element);
            if (element) {
                element.dataset.target = counter.target;
                element.dataset.suffix = counter.suffix;
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (suffix.includes('K')) {
                    element.textContent = Math.floor(current / 1000) + 'K+';
                } else if (suffix.includes('%')) {
                    element.textContent = Math.floor(current) + '%';
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = (suffix.includes('K') ? Math.floor(target / 1000) + 'K+' : target + suffix);
            }
        };

        updateCounter();
    }

    setup3DEffects() {
        // Add CSS for 3D transformations
        const style = document.createElement('style');
        style.textContent = `
            .project-card {
                transform-style: preserve-3d;
                transition: transform 0.3s ease;
            }
            
            .project-card:hover {
                transform: translateY(-10px) scale(1.02);
            }
            
            .animate-in {
                animation: slideInUp 0.8s ease forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            background-color: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href');
        const element = document.querySelector(target);
        
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Audio feedback methods
    playFilterSound() {
        this.playTone(800, 0.1, 'sine');
    }

    playHoverSound() {
        this.playTone(1000, 0.05, 'sine');
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

    // Public methods for external use
    filterProjectsByCategory(category) {
        this.filterProjects(category);
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === category);
        });
    }

    highlightProject(projectId) {
        const card = document.querySelector(`[data-project="${projectId}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth' });
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = '';
            }, 1000);
        }
    }

    // Initialize enhanced features
    addEnhancedFeatures() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleKeyboardNavigation(e);
            }
        });

        // Add touch gestures for mobile
        this.setupTouchGestures();
        
        // Add accessibility improvements
        this.enhanceAccessibility();
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Handle swipe gestures for filtering
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.nextFilter();
                    } else {
                        this.previousFilter();
                    }
                }
            }

            touchStartX = 0;
            touchStartY = 0;
        });
    }

    nextFilter() {
        const filters = ['all', 'web', 'frontend', 'fullstack', 'mobile'];
        const currentIndex = filters.indexOf(this.currentFilter);
        const nextIndex = (currentIndex + 1) % filters.length;
        this.currentFilter = filters[nextIndex];
        this.filterProjectsByCategory(this.currentFilter);
    }

    previousFilter() {
        const filters = ['all', 'web', 'frontend', 'fullstack', 'mobile'];
        const currentIndex = filters.indexOf(this.currentFilter);
        const prevIndex = (currentIndex - 1 + filters.length) % filters.length;
        this.currentFilter = filters[prevIndex];
        this.filterProjectsByCategory(this.currentFilter);
    }

    enhanceAccessibility() {
        // Add ARIA labels and descriptions
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Project ${index + 1}`);
            card.setAttribute('tabindex', '0');
        });

        // Add focus management
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('focus', (e) => {
                e.target.style.outline = '2px solid var(--accent-color)';
            });
            btn.addEventListener('blur', (e) => {
                e.target.style.outline = '';
            });
        });
    }

    handleKeyboardNavigation(e) {
        const focusableElements = document.querySelectorAll(
            '.filter-btn, .project-card, .btn, a[href]'
        );
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey && currentIndex > 0) {
            focusableElements[currentIndex - 1].focus();
        } else if (!e.shiftKey && currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1].focus();
        }
    }
}

// Add ripple animation CSS
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const projectsController = new ProjectsController();
    projectsController.addEnhancedFeatures();
    
    // Make it globally accessible
    window.projectsController = projectsController;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsController;
}
