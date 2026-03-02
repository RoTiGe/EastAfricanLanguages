/**
 * Language Bridge — Service Worker  (v2 — full offline support)
 *
 * Caching strategies:
 *   Static assets          → Cache-first  (CSS, JS, fonts, icons, CDN)
 *   Key HTML pages         → Pre-cached on install; network-first thereafter
 *   All other HTML pages   → Network-first, stored on first visit
 *   Data APIs (read-only)  → Stale-while-revalidate  (/api/categories, /api/phrases)
 *   Write/TTS APIs         → Network-only  (POST /api/speak, /api/submit-translation)
 */

// ── Bump this string whenever you deploy a new version ───────────────────────
const CACHE_NAME = 'language-bridge-v2';
const OFFLINE_URL = '/offline.html';

// Read-only GET endpoints whose JSON responses are safe to cache indefinitely
const CACHEABLE_API_PREFIXES = [
    '/api/categories/',
    '/api/phrases/',
    '/api/languages',
    '/api/contextual/phrases',
];

// ── Pages pre-fetched and stored during SW install ───────────────────────────
// These work offline even on the very first app open.
const PRECACHE_PAGES = [
    '/',
    '/emergency',
    '/matching-game',
    '/translate',
    '/conversations',
    '/about',
    '/learn-letters',
    '/offline.html',
];

// ── Static assets pre-cached on install ──────────────────────────────────────
const PRECACHE_ASSETS = [
    '/css/style.css',
    '/js/main.js',
    '/manifest.json',
    '/icons/icon.svg',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        // Cache static assets (fail silently for CDN if offline during install)
        await cache.addAll(PRECACHE_ASSETS).catch(err =>
            console.warn('[SW] Asset pre-cache partial failure:', err)
        );

        // Cache each key HTML page individually so one failure doesn't block others
        await Promise.allSettled(
            PRECACHE_PAGES.map(url =>
                fetch(url, { credentials: 'same-origin' })
                    .then(res => { if (res.ok) cache.put(url, res); })
                    .catch(() => console.warn('[SW] Could not pre-cache page:', url))
            )
        );

        await self.skipWaiting();
    })());
});

// ── Activate: wipe old caches ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// ── Fetch routing ─────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle GET over http(s)
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;

    // Static assets → cache-first
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Read-only data APIs → stale-while-revalidate (works fully offline)
    if (isCacheableApi(url)) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // All other /api/ calls (TTS, submit) → network-only, never cache
    if (url.pathname.startsWith('/api/')) return;

    // HTML navigation → network-first with offline fallback
    event.respondWith(networkFirstWithOfflineFallback(request));
});

// ── Strategy helpers ──────────────────────────────────────────────────────────

function isStaticAsset(url) {
    return url.pathname.match(/\.(css|js|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|ico)$/) ||
           url.hostname.includes('cdn.jsdelivr.net') ||
           url.hostname.includes('fonts.googleapis.com') ||
           url.hostname.includes('fonts.gstatic.com');
}

function isCacheableApi(url) {
    return CACHEABLE_API_PREFIXES.some(prefix => url.pathname.startsWith(prefix));
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Asset unavailable offline', { status: 503 });
    }
}

/**
 * Stale-while-revalidate:
 * Serve the cached version immediately (instant load), then fetch a fresh copy
 * in the background and update the cache for next time.
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    // Kick off a background refresh regardless
    const fetchPromise = fetch(request)
        .then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
        })
        .catch(() => null);   // swallow network errors when offline

    // Return cached copy instantly; fall back to network if nothing cached yet
    return cached || fetchPromise ||
        new Response(JSON.stringify({ error: 'Offline — data not yet cached' }),
                     { status: 503, headers: { 'Content-Type': 'application/json' } });
}

async function networkFirstWithOfflineFallback(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        return cache.match(OFFLINE_URL) ||
               new Response('<h1>Offline</h1><p>Please check your connection.</p>',
                            { headers: { 'Content-Type': 'text/html' } });
    }
}


