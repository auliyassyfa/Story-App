import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

// Do precaching
precacheAndRoute(self.__WB_MANIFEST);

// Navigation fallback untuk SPA (Single Page App)
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

// Caching data cerita
registerRoute(
  ({ request, url }) => {
    return url.origin === new URL(BASE_URL).origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api-data',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// Caching gambar cerita
registerRoute(
  ({ request, url }) => {
    return url.origin === new URL(BASE_URL).origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// Caching tiles peta OSM
registerRoute(
  ({ url }) => url.origin === 'https://c.tile.openstreetmap.org',
  new StaleWhileRevalidate({
    cacheName: 'osm-tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Push notification listener
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received');

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error('[Service Worker] Push event data is not JSON:', e);
  }

  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data?.options?.body || 'Ada update terbaru!',
    icon: '/images/logo.png', // pastikan file ini ada
    badge: '/images/logo.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
