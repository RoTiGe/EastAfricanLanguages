/**
 * Language Bridge — Service Worker
 * Strategy:
 *   Static assets  → Cache-first (CSS, JS, fonts, icons)
 *   HTML pages     → Network-first with offline fallback
 *   API calls      → Network-only (never cache dynamic data)
 */

const CACHE_NAME = 'language-bridge-v1';
const OFFLINE_URL = '/offline.html';

// Static assets to pre-cache on install
const PRECACHE_URLS = [
    '/',
    '/offline.html',
    '/css/style.css',
    '/js/main.js',
    '/manifest.json',
    '/icons/icon.svg',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css'
];

// ── Install: pre-cache core assets ──────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_URLS).catch(err => {
                // Don't fail install if CDN assets can't be cached offline
                console.warn('[SW] Pre-cache partial failure (CDN may be unavailable):', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// ── Activate: remove old caches ──────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: route requests ────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and browser-extension requests
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;

    // API calls → always network-only
    if (url.pathname.startsWith('/api/')) return;

    // Static assets (CSS, JS, images, fonts, icons) → cache-first
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // HTML navigation → network-first with offline fallback
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirstWithOfflineFallback(request));
        return;
    }

    // Everything else → network-first
    event.respondWith(networkFirst(request));
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function isStaticAsset(url) {
    return url.pathname.match(/\.(css|js|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|ico)$/) ||
           url.hostname.includes('cdn.jsdelivr.net') ||
           url.hostname.includes('fonts.googleapis.com') ||
           url.hostname.includes('fonts.gstatic.com');
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

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return caches.match(request) || new Response('Unavailable offline', { status: 503 });
    }
}

async function networkFirstWithOfflineFallback(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return caches.match(OFFLINE_URL) ||
               new Response('<h1>Offline</h1><p>Please check your connection.</p>',
                            { headers: { 'Content-Type': 'text/html' } });
    }
}

