// Optimized Skills Controller - Reduced Animations
class SkillsController {
    constructor() {
        this.init();
    }

    init() {
        this.loadOptimizedStyles();
        this.setupIntersectionObserver();
        this.initializeSkillBars();
    }

    loadOptimizedStyles() {
        // Load optimized skills CSS
        if (!document.querySelector('link[href*="skills-optimized.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/skills-optimized.css';
            document.head.appendChild(link);
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Animate skill bars with a delay
                    if (entry.target.classList.contains('skill-category')) {
                        setTimeout(() => {
                            this.animateSkillBars(entry.target);
                        }, 300);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe skill categories
        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
    }

    animateSkillBars(category) {
        const skillBars = category.querySelectorAll('.level-bar[data-level]');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const level = bar.getAttribute('data-level');
                bar.style.width = level + '%';
            }, index * 100); // Stagger the animations slightly
        });
    }

    initializeSkillBars() {
        // Set up initial state for skill bars
        document.querySelectorAll('.level-bar[data-level]').forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1s ease';
        });
    }

    // Simple hover effects without excessive animations
    addSimpleInteractions() {
        document.querySelectorAll('.skill-icon').forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                skill.style.transform = 'translateY(-3px)';
            });
            
            skill.addEventListener('mouseleave', () => {
                skill.style.transform = 'translateY(0)';
            });
        });
    }

    // Reset animations if needed
    resetAnimations() {
        document.querySelectorAll('.skill-category').forEach(category => {
            category.classList.remove('in-view');
        });
        
        document.querySelectorAll('.level-bar').forEach(bar => {
            bar.style.width = '0%';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const skillsController = new SkillsController();
    skillsController.addSimpleInteractions();
    
    // Make it globally accessible
    window.skillsController = skillsController;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsController;
}
