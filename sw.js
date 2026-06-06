const VERSION='nexocreator-v5-local-drafts-recovery';

self.addEventListener('install',event=>{
 self.skipWaiting();
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.map(k=>caches.delete(k)));
   await self.clients.claim();
 })());
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET') return;
 const url=new URL(event.request.url);

 if(url.pathname.endsWith('/assets/js/app.js')){
   event.respondWith((async()=>{
     const appRes=await fetch(event.request,{cache:'reload'});
     const appText=await appRes.text();
     let recoveryText='';
     try{
       const recoveryUrl=new URL('assets/js/local-drafts-recovery.js', self.registration.scope).toString();
       const recoveryRes=await fetch(recoveryUrl,{cache:'reload'});
       if(recoveryRes.ok) recoveryText=await recoveryRes.text();
     }catch(err){
       recoveryText='console.warn("No se pudo cargar local-drafts-recovery", '+JSON.stringify(String(err))+');';
     }
     return new Response(appText+'\n\n'+recoveryText,{
       status:200,
       headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}
     });
   })());
   return;
 }

 event.respondWith(fetch(event.request,{cache:'reload'}));
});
