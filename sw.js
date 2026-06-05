const VERSION='nexocreator-v4-refresco';

self.addEventListener('install',event=>{
 self.skipWaiting();
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.map(k=>caches.delete(k)));
   await self.clients.claim();
   const clients=await self.clients.matchAll({type:'window'});
   clients.forEach(client=>client.navigate(client.url));
 })());
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET') return;
 event.respondWith(fetch(event.request,{cache:'reload'}));
});
