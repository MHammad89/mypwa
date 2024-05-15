const CACHE_NAME = 'v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/app.js',
    '/images/logo192.png', 
    '/offline.html'
];
/* eslint-disable no-restricted-globals */

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


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            
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