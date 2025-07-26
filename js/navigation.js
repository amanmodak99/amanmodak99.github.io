/**
 * =================================
 * NAVIGATION MANAGEMENT
 * =================================
 */

class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');
        this.sections = document.querySelectorAll('section[id]');
        
        this.isMenuOpen = false;
        this.lastScrollY = window.scrollY;
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupActiveNavigation();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
    }

    setupMobileMenu() {
        if (!this.hamburger || !this.navLinks) return;

        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu when clicking nav links
        this.navItems.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navLinks.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.hamburger.classList.add('active');
        this.navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first nav item for accessibility
        const firstNavItem = this.navItems[0];
        if (firstNavItem) {
            setTimeout(() => firstNavItem.focus(), 100);
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.hamburger.classList.remove('active');
        this.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupScrollBehavior() {
        if (!this.navbar) return;

        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Hide/show navbar based on scroll direction
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }

            this.lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    setupActiveNavigation() {
        if (this.sections.length === 0 || this.navItems.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveNavItem(entry.target.id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveNavItem(sectionId) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            if (href && href.includes(`#${sectionId}`)) {
                item.classList.add('active');
            }
        });
    }

    setupSmoothScrolling() {
        this.navItems.forEach(item => {
            const href = item.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                });
            }
        });

        // Handle smooth scroll for other anchor links
        document.querySelectorAll('a[href^=\"#\"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                this.smoothScrollTo(href);
            });
        });
    }

    smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const offsetTop = target.offsetTop - (this.navbar?.offsetHeight || 70);
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    setupKeyboardNavigation() {
        this.navItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % this.navItems.length;
                        this.navItems[nextIndex].focus();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + this.navItems.length) % this.navItems.length;
                        this.navItems[prevIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.navItems[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.navItems[this.navItems.length - 1].focus();
                        break;
                }
            });
        });
    }
}

// Initialize navigation manager
const navigationManager = new NavigationManager();
