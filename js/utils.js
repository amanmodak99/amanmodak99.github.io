/**
 * =================================
 * PERFORMANCE & UTILITIES
 * =================================
 */

class PerformanceManager {
    constructor() {
        this.isSupported = this.checkSupport();
        this.metrics = {};
        this.init();
    }

    init() {
        if (!this.isSupported) return;
        
        this.setupPerformanceObserver();
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.preloadCriticalResources();
        this.setupServiceWorker();
    }

    checkSupport() {
        return 'IntersectionObserver' in window && 
               'performance' in window && 
               'requestAnimationFrame' in window;
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics[entry.name] = entry;
                    
                    // Log significant metrics
                    if (entry.entryType === 'navigation') {
                        console.log('Navigation timing:', {
                            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                            loadComplete: entry.loadEventEnd - entry.loadEventStart,
                            totalTime: entry.loadEventEnd - entry.navigationStart
                        });
                    }
                }
            });
            
            observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
        }
    }

    setupIntersectionObserver() {
        // Optimize animations based on viewport visibility
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    // Pause expensive animations when out of view
                    entry.target.classList.remove('animate');
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });
    }

    setupLazyLoading() {
        // Native lazy loading for modern browsers
        const images = document.querySelectorAll('img[data-src]');
        
        if ('loading' in HTMLImageElement.prototype) {
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.loading = 'lazy';
            });
        } else {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupImageOptimization() {
        // Convert images to WebP if supported
        const supportsWebP = this.checkWebPSupport();
        
        if (supportsWebP) {
            document.querySelectorAll('img').forEach(img => {
                const src = img.src || img.dataset.src;
                if (src && !src.includes('.webp')) {
                    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    img.src = webpSrc;
                }
            });
        }
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 1, 1);
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Debounce utility
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle utility
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Prefers reduced motion check
    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Memory usage monitoring
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    // Performance metrics
    getMetrics() {
        return {
            ...this.metrics,
            memory: this.getMemoryUsage(),
            connection: this.getConnectionInfo()
        };
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    }
}

/**
 * =================================
 * UTILITY FUNCTIONS
 * =================================
 */

class Utils {
    // DOM manipulation utilities
    static $(selector, context = document) {
        return context.querySelector(selector);
    }

    static $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }

    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'dataset') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    }

    // Animation utilities
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    static slideDown(element, duration = 300) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const currentHeight = Math.min((progress / duration) * height, height);
            
            element.style.height = currentHeight + 'px';
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Data utilities
    static formatDate(date, options = {}) {
        const defaults = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('en-US', { ...defaults, ...options })
            .format(new Date(date));
    }

    static formatNumber(number, options = {}) {
        return new Intl.NumberFormat('en-US', options).format(number);
    }

    static slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Validation utilities
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    // Storage utilities
    static setStorage(key, value, isSession = false) {
        const storage = isSession ? sessionStorage : localStorage;
        try {
            storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    static getStorage(key, defaultValue = null, isSession = false) {
        const storage = isSession ? sessionStorage : localStorage;
        try {
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage error:', e);
            return defaultValue;
        }
    }

    static removeStorage(key, isSession = false) {
        const storage = isSession ? sessionStorage : localStorage;
        storage.removeItem(key);
    }

    // Device detection
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
            .test(navigator.userAgent);
    }

    static isTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    static getDeviceInfo() {
        return {
            isMobile: this.isMobile(),
            isTouch: this.isTouch(),
            pixelRatio: window.devicePixelRatio || 1,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    }

    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Random utilities
    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static generateId(prefix = 'id') {
        return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Initialize performance manager
const performanceManager = new PerformanceManager();

// Export utilities globally
window.Utils = Utils;
window.PerformanceManager = performanceManager;
