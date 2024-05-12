const CACHE_NAME = 'v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/app.js',
    '/images/logo192.png', // Ensure this path is correct
    '/offline.html'
];
/* eslint-disable no-restricted-globals */
// Install event: Cache necessary files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(assetsToCache);
            })
            .catch(err => console.error('Error while caching assets:', err))
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve cached content if offline or fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse; // return the cached response if found
            }

            // Attempt to fetch from the network or provide a fallback if offline
            return fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }

                // Optional: Customize responses for specific requests, e.g., API calls
                if (event.request.url.includes('/api/')) {
                    return new Response(JSON.stringify({ error: "Offline" }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            });
        })
    );
});