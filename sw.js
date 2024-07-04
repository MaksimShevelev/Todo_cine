const CACHE_NAME = 'Cache-v1';
const OFFLINE_PAGE = "/offline.html";
// Guardo en el cache los archivos de la aplicación
const CACHE_FILES = [
    '/',
    'index.html',
    'css/styles.css',
    'favoritos.html',
    'offline.html',
    'historial.html',
    'app.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'img/icon.png',
    'img/fondo.jpg',
    'img/offline.png',
    'img/foto.png'
];

// Cuando se instala el SW, Guardo todo en el cache
self.addEventListener('install', (e) => {
    const cache = caches.open(CACHE_NAME).then(cache => {
        console.log(cache)
        return cache.addAll(CACHE_FILES);
    }).catch( error => {
        console.error({error})
    });
    // Espero hasta que la promesa termine
    e.waitUntil(cache);
});

self.addEventListener('fetch', (e) => {
    // Primero Desde la Web
    const respuesta = fetch(e.request).then(respNet => {
        // Aprovecho y guardo en el cache lo nuevo
        return caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, respNet.clone());
            return respNet;
        });
    // Si no hay conexión
    }).catch(error => {
        return caches.match(e.request);
    });

    e.respondWith(respuesta);
});

function fromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                if (request.destination !== "document" || request.mode !== "navigate") {
                    return Promise.reject("no-match");
                }
                return cache.match(OFFLINE_PAGE);
            }
            return matching;
        });
    });
}
