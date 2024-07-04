const CACHE_NAME = 'cache-v1';
const CACHE_FILES = [
  '/',
  'index.html',
  'favoritos.html',
  'estilos.css',
  'app.js',
  'favoritos.js',
  'libs/pouchdb-8.0.1.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'img/icono-cine.png',
  'img/icono-error.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('CACHE OPENED');
      return cache.addAll(CACHE_FILES);
    }).catch(function(error) {
      console.error('Error al intentar agregar recursos al caché:', error);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
