const CACHE_NAME = 'beaver-runner-v1.0';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/main.js',
  '/js/core/GameEngine.js',
  '/js/core/InputManager.js',
  '/js/core/StateManager.js',
  '/js/game/Beaver.js',
  '/js/game/Obstacle.js',
  '/js/game/Background.js',
  '/js/game/Effects.js',
  '/js/audio/AudioManager.js',
  '/js/audio/MusicSystem.js',
  '/js/utils/MathUtils.js',
  '/js/utils/DeviceUtils.js',
  '/js/utils/AssetLoader.js'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэширование ресурсов');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированный ресурс или делаем запрос
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback для offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});