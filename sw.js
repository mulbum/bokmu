var CACHE='bokmu-v1';
var SHELL=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
 if(u.origin===location.origin&&(r.mode==='navigate'||u.pathname.endsWith('/index.html'))){
  // 앱 화면: 온라인이면 새 버전, 오프라인이면 저장된 버전
  e.respondWith(fetch(r).then(function(res){var c=res.clone();caches.open(CACHE).then(function(ca){ca.put('./index.html',c)});return res}).catch(function(){return caches.match('./index.html')}));return}
 // 아이콘·글꼴 등: 저장된 것 먼저, 없으면 받아서 저장
 e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var c=res.clone();caches.open(CACHE).then(function(ca){ca.put(r,c)})}return res})}))});
