const CACHE_NAME = 'tower-of-hanoi-v1';
const URLS_TO_CACHE = [
  'index.html',
  'style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js',
  'script.js',
  'manifest.json',
  '192x192.png'
];


self.addEventListener('install', function(installation) {
  installation.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache){
      return cache.addAll(URLS_TO_CACHE);
    })
  );

});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if(response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
