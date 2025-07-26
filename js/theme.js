/**
 * =================================
 * THEME MANAGEMENT
 * =================================
 */

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.htmlElement = document.documentElement;
        this.currentTheme = this.getStoredTheme();
        
        this.init();
    }

    init() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        // Default to light theme unless explicitly saved as dark
        this.currentTheme = savedTheme === 'dark' ? 'dark' : 'light';
        
        this.applyTheme();
        this.setupEventListeners();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.currentTheme = 'light'; // Always default to light
                this.applyTheme();
            }
        });
    }

    getStoredTheme() {
        return localStorage.getItem('theme') || this.getSystemTheme();
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'light') {
            this.htmlElement.classList.add('light-mode');
        } else {
            this.htmlElement.classList.remove('light-mode');
        }

        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
        this.dispatchThemeChange();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add animation effect
        this.animateThemeToggle();
    }

    updateThemeIcon() {
        if (!this.themeToggle) return;
        
        const moonIcon = this.themeToggle.querySelector('.fa-moon');
        const sunIcon = this.themeToggle.querySelector('.fa-sun');
        
        if (this.currentTheme === 'light') {
            moonIcon?.style.setProperty('display', 'none');
            sunIcon?.style.setProperty('display', 'block');
        } else {
            moonIcon?.style.setProperty('display', 'block');
            sunIcon?.style.setProperty('display', 'none');
        }
    }

    animateThemeToggle() {
        if (!this.themeToggle) return;
        
        this.themeToggle.style.transform = 'scale(0.8) rotate(360deg)';
        
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }

    listenForSystemThemeChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    dispatchThemeChange() {
        const event = new CustomEvent('themechange', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();
