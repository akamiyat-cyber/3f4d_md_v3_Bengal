// キャッシュ名（アプリを更新した場合はここを v2, v3... と書き換えます）
const CACHE_NAME = '3f4d-pro-v1';

// オフラインで利用するためにキャッシュするファイルのリスト
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './slide_en_water.png', // スクリプト内で使用されている画像
  './icon.png',           // アイコン画像
  
  // 外部ライブラリ (CDN)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'
];

// 1. インストール：必要なファイルを保存する
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Assets caching started');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. 有効化：古いキャッシュを削除する
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Old cache deleted');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. フェッチ：ネットワークがない時はキャッシュから返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュがあればそれを返し、なければネットワークへ行く
      return response || fetch(event.request).catch(() => {
        // 画像のリクエストが失敗した場合などのフォールバック処理をここに追加可能
      });
    })
  );
});