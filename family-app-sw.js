const CACHE = 'family-app-v1';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(['./family-app.html','./family-app-manifest.json','./family-app-icon.svg'])
       .catch(()=>{})
    ).then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys=>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.url.includes('firebasedatabase')||
     e.request.url.includes('gstatic.com/firebasejs')||
     e.request.url.includes('googleapis.com')){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
