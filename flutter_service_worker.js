'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "favicon.ico": "0c2cc0f5269586de903f6a886a934075",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/AssetManifest.json": "7bcd571f141a28aef13091c175e78144",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/assets/images/dog-app-logo.png": "8c882268a453122b8112473d3a37bfef",
"assets/assets/images/tw.svg": "abfbd4d99d3eb68a202695654eeccf9c",
"assets/assets/images/fb_64px.png": "5b6d4c9ef849117808bd80d3e68237eb",
"assets/assets/images/ig_48px.png": "a5272a61e585e05b583391dfb0faec7b",
"assets/assets/images/ai.gif": "0e151800ca13d5de6bfdb98c33539815",
"assets/assets/images/ig.svg": "b26b06a7d802713aeb9c229999236b93",
"assets/assets/images/calculusFormuals.png": "2a47838e21516edb842de6a35526c710",
"assets/assets/images/twitter_logo_icon.png": "a7edf8db708c304d8a3226bf8757a26d",
"assets/assets/images/ig_64px.png": "b2fabc5bace81fc51f48fe0feb69bb42",
"assets/assets/images/facebook_logo_icon.png": "684cddb36c3512c7691deb115f29e27b",
"assets/assets/images/cr_icon.svg": "7df65039eb1116fdd993fba8f94469d9",
"assets/assets/images/instagram_logo_icon.png": "636c945ee1197eda5adf515a2fba3cf8",
"assets/assets/images/cr_icon.png": "483960a81736e3e76b795f752e0d7e8b",
"assets/assets/images/4pics1WordLogo.png": "ca92aa6b3052552a48e6054da50e8851",
"assets/assets/images/tw_64px.png": "59b35a0dc37781cd381b6b3ea6f00c8f",
"assets/assets/images/fb.svg": "1e80416aa91f53526b9135b7fbcb8474",
"assets/assets/images/hackersimulation.webp": "6e628b87ca5e331d1d3b0c3f5e95e966",
"assets/assets/images/calculator_background_hd.jpg": "7e11d27566bbfa9b808dd199acfdf003",
"assets/shaders/ink_sparkle.frag": "52a81f2bfd3666fd44346152cc7eb26f",
"assets/NOTICES": "070abf7bb57af370f6038c951279e190",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"icons/apple-touch-icon.png": "be9b0df34718aa516a06e07b8c91efe0",
"icons/mstile-150x150.png": "318619462d2609e848128163e607179d",
"icons/safari-pinned-tab.svg": "dbd1316b273c1fde6c05bfc6551a3bbf",
"icons/android-chrome-512x512.png": "7db77c8127f5eb2fd1b381c05b1a8ed0",
"icons/favicon-16x16.png": "3763b131e1008dffd09b96bad7edf267",
"icons/android-chrome-192x192.png": "6f46f3ef82bea19ccf51d9f339741055",
"icons/favicon-32x32.png": "a0494bf4ceaeecb88c75453310f24f0c",
"privacy_policy/4-images-1-term-privacy-policy.html": "18bc5b0495d4519d83a98567fd2b628d",
"privacy_policy/calculus-formulas-privacy-policy.html": "27c7478a3190d8e57108914abc1ba474",
"privacy_policy/hacker-simulation-privacy-policy.html": "da60f587bf3df10ad922fabe06ae0518",
"manifest.json": "778284a8d73d4d18b375320fc0c8b101",
"version.json": "b3e61575a74e9dd8ebf20fbf78b62468",
"main.dart.js": "1eae65a5e70d044afe4f462bf1797b5b",
"index.html": "db23c25082ff61e3984b57f6572e265d",
"/": "db23c25082ff61e3984b57f6572e265d"
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
