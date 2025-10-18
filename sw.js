// Service Worker para PetCare PWA
const CACHE_NAME = 'petcare-v1.0.0';
const urlsToCache = [
  '/petcare-pwa/',
  '/petcare-pwa/index.html',
  '/petcare-pwa/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Devolver desde cache si existe
        if (response) {
          return response;
        }
        
        // Si no está en caché, hacer fetch
        return fetch(event.request).then(function(response) {
          // Verificar si es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(function() {
        // Si falla todo, mostrar página offline
        if (event.request.destination === 'document') {
          return caches.match('/petcare-pwa/index.html');
        }
      })
  );
});

// Manejar mensajes del cliente
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificaciones Push (opcional)
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de PetCare',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🐾%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🐾%3C/text%3E%3C/svg%3E',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver más',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E👀%3C/text%3E%3C/svg%3E'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E❌%3C/text%3E%3C/svg%3E'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('PetCare Marketplace', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // No hacer nada, solo cerrar
  } else {
    // Click en la notificación principal
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});