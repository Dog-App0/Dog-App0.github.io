'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "favicon.ico": "1ccd2abd4c5fc52e645dd14b641cb58a",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/AssetManifest.json": "be9b7225dc2217df4ff28fc74c67cb4c",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/assets/images/ai_img.png": "404844d7b1a34ac458fb5ef163ddee77",
"assets/assets/images/desktop_dogapp1.png": "1667dba2ed95ae3aa186479d2f8f2331",
"assets/assets/images/maps.png": "379d362f4d98f45e9b53edefebe4e111",
"assets/assets/images/mobile_dogapp1.png": "4e7fa79a08cb5f48b683eb62113463d2",
"assets/assets/images/dogapp_icon.png": "251e9165202d87da9ebadc4a2cce9eff",
"assets/assets/images/products.png": "d9f0ad9ab1eba11951f27fe57dee96e7",
"assets/assets/images/breedID.png": "958a5ec67adbc17b12a21f4a86ac7aa1",
"assets/shaders/ink_sparkle.frag": "52a81f2bfd3666fd44346152cc7eb26f",
"assets/NOTICES": "292492179a1bc29317d184d943ec134d",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"icons/apple-icon-72x72.png": "2e9340ce2044527aaeeb89cdbeb33709",
"icons/android-icon-72x72.png": "2e9340ce2044527aaeeb89cdbeb33709",
"icons/apple-icon-76x76.png": "6c0815adc7eee9a6627cd968d84c082a",
"icons/ms-icon-150x150.png": "511e427269d7156644b1ded9f1465545",
"icons/apple-icon-60x60.png": "dbe015395f04c9757d5f7c409713f7b1",
"icons/apple-icon-120x120.png": "1cb121bae93ab0c1fba423067ea06569",
"icons/apple-icon-57x57.png": "cbb79759c4f32df0e98ea10958615fa9",
"icons/android-icon-192x192.png": "f17144ff3d11309e4ec88e767f7ea147",
"icons/android-icon-48x48.png": "417db6806e1731901e824bfff1d1fc51",
"icons/ms-icon-144x144.png": "404c5a064705859a82649d0d27c06687",
"icons/ms-icon-310x310.png": "3633bf429d46fee374c75939c2eaec2b",
"icons/android-icon-36x36.png": "7cb878dcb0f99d5cd18676304e58d8eb",
"icons/apple-icon-114x114.png": "2578f4520e07dcc9fbc236d36192bece",
"icons/apple-icon.png": "6a27b7e9a5a495efa34c4c582c39c8dd",
"icons/apple-icon-144x144.png": "404c5a064705859a82649d0d27c06687",
"icons/favicon-96x96.png": "2a9fd3e360cbce7fe92fd2398527ccd3",
"icons/android-icon-96x96.png": "2a9fd3e360cbce7fe92fd2398527ccd3",
"icons/android-icon-144x144.png": "404c5a064705859a82649d0d27c06687",
"icons/apple-icon-152x152.png": "a33aa325185d3034529bdd9a2c2acc3e",
"icons/favicon-16x16.png": "c0967d855ef679fc7b517b509f08e892",
"icons/apple-icon-precomposed.png": "6a27b7e9a5a495efa34c4c582c39c8dd",
"icons/apple-icon-180x180.png": "0fa4ec4713472f3a3d5377b1eef6d807",
"icons/ms-icon-70x70.png": "51530ad717466102882e629ed05a7bfe",
"icons/favicon-32x32.png": "f350efc57066d6b67fd46df3200c5908",
"manifest.json": "ef7944fa9703754c22dbba14ca1b2e40",
"version.json": "d1db5082f35c03dcd0ea7551756e72ee",
"main.dart.js": "932407dd7d3eb59d9d0ac9ae604d5b00",
"index.html": "ee2fccba41fc12b5a5958d88250bb81b",
"/": "ee2fccba41fc12b5a5958d88250bb81b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
