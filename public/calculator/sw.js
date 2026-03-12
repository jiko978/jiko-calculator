// ─────────────────────────────────────────────────────────
// public/calculator/sw.js — Service Worker (개발/운영 구분)
// ─────────────────────────────────────────────────────────

const IS_DEV = self.location.hostname === "localhost"
    || self.location.hostname === "127.0.0.1";

const CACHE_NAME = "jiko-calculator-v2";

const STATIC_ASSETS = [
    "/calculator",
    "/calculator/stock",
    "/calculator/stock/avg-price",
    "/calculator/stock/profit-rate",
    "/calculator/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/icons/apple-touch-icon.png",
    "/icons/favicon-32x32.png",
    "/icons/favicon-16x16.png",
];

// 설치: 운영에서만 사전 캐시
self.addEventListener("install", (event) => {
    if (!IS_DEV) {
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
        );
    }
    self.skipWaiting();
});

// 활성화: 이전 캐시 정리
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// fetch: 개발(네트워크만) / 운영(네트워크 우선 + 캐시 폴백)
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    if (!event.request.url.startsWith("http")) return;

    // 개발: 캐시 사용 안함, 항상 네트워크
    if (IS_DEV) {
        event.respondWith(fetch(event.request));
        return;
    }

    // 운영: Network First + 캐시 폴백
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});