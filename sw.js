function cache(request, response) {
    if (response.type === 'error' || response.type === 'opaque') {
        return Promise.resolve();
    }

    return caches.open('tsuzuku-games').then((c) => c.put(request, response.clone()));
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open('tsuzuku-games')
            .then((c) => c.addAll([
                // local
                './',
                './index.css',
                './index.js',
                './logo-192.png',
                './logo-512.png',
                './logo-maskable-192.png',
                './logo-maskable-512.png',
                './manifest.webmanifest',

                // third-party
                'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2',
                'anime-offline-database.json'
                // 'https://raw.githubusercontent.com/manami-project/anime-offline-database/master/anime-offline-database.json'
            ]))
    );
});

self.addEventListener('message', (event) => {
    if (event.data.update) {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
            .match(event.request, {
                ignoreSearch: true
            })
            .then((cached) => fetch(event.request)
                .then((response) => cache(event.request, response).then(() => response))
                .catch(() => cached))
    );
});