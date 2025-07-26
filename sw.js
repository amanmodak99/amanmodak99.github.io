// Service Worker for caching and offline functionality
const CACHE_NAME = 'aman-portfolio-v4.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/projects.html',
    '/certifications.html',
    '/css/variables.css',
    '/css/base.css',
    '/css/layout.css',
    '/css/components.css',
    '/css/pages.css',
    '/css/animations.css',
    '/css/advanced-animations.css',
    '/css/3d-effects.css',
    '/css/enhanced-sections.css',
    '/css/projects-enhanced.css',
    '/css/certifications-enhanced.css',
    '/css/contact-enhanced.css',
    '/css/extras.css',
    '/js/utils.js',
    '/js/theme.js',
    '/js/navigation.js',
    '/js/animations.js',
    '/js/advanced-effects.js',
    '/js/3d-controller.js',
    '/js/projects-controller.js',
    '/js/contact-controller.js',
    '/js/interactions.js',
    '/script.js',
    '/style.css',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
