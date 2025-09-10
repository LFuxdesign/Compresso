/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { ExpirationPlugin } from 'workbox-expiration';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

/** @type {RegExp[] | undefined} */
let allowlist
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    (url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.gif') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.mp4') ||
      url.pathname.endsWith('.mp3') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.ttf') ||
      url.pathname.endsWith(".lottie") ||
      url.pathname.endsWith(".wasm") ||
      url.pathname.endsWith('.woff')
    ),
  new StaleWhileRevalidate({
    cacheName: 'cacheGeneralSWRK',
    plugins: [
      // new ExpirationPlugin({ maxEntries: 9999 }),
      new ExpirationPlugin({
        maxAgeSeconds: 432000,
      }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    ( url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.json')),
  new StaleWhileRevalidate({
    cacheName: 'cacheDocsSWRK',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 432000,
      }),
    ],
  })
);


// Cache e revalida a API de imagens
registerRoute(
  ({ url }) => url.pathname === '/api/get/images',
  new StaleWhileRevalidate({
    cacheName: 'api-images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // máximo de 50 arquivos no cache
        maxAgeSeconds: 24 * 60 * 60, // 1 dia de validade
      }),
    ],
  })
);


registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    ( url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.html')),
  new NetworkFirst({
    cacheName: 'cacheJSSWRK',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 432000,
      }),
    ],
  })
);
self.skipWaiting()
clientsClaim()
