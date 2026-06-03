const CACHE = 'family-points-v1';
const ASSETS = [
  './family.html',
  './family-manifest.json',
  './family-icon.svg',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=DM+Mono:wght@500&display=swap',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(ASSETS.map(a => c.add(a).catch(()=>{})));
    }).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  // Firebase・外部APIは常にネットワーク優先
  if(e.request.url.includes('firebasedatabase') ||
     e.request.url.includes('googleapis.com') ||
     e.request.url.includes('gstatic.com/firebasejs')) {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
