const PROFILE_CACHE = 'basic-static-cache'

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(PROFILE_CACHE).then(cache => {
            return cache.addAll([
                '/loading.gif'
            ])
        })
    )
})

self.addEventListener('activate', e => {
    console.log('SW is activated...')
})

self.addEventListener('fetch', e => {
    e.respondWith(fromCache(e.request))
})

const fromCache = req => {
    caches.open(PROFILE_CACHE).then(cache => {
        cache.match(req).then(mathching => mathching || Promise.reject('no-match'))
    })
}