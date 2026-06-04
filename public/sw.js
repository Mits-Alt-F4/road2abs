const CACHE = 'road2abs-v1'
const OFFLINE_URL = '/offline'

const APP_SHELL = [
  '/',
  '/today',
  '/offline',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== location.origin) return
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, clone))
        return response
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached
          if (event.request.headers.get('Accept')?.includes('text/html')) {
            return caches.match(OFFLINE_URL)
          }
        })
      )
  )
})
