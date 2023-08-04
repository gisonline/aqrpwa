importScripts('assets/vendor/workbox-6.1.5/workbox-sw.js');

workbox.setConfig({
  debug: false,
  modulePathPrefix: 'assets/vendor/workbox-6.1.5/'
});

workbox.precaching.precacheAndRoute([
  {url: 'index.html', revision: '4'},
  {url: 'manifest.json', revision: '1'},
  {url: 'assets/js/config.js', revision: '3'},
  {url: 'assets/css/app.css', revision: '6'},
  {url: 'assets/js/app.js', revision: '6'},
  {url: 'assets/img/apple-touch-icon.png', revision: '09.09.20.2'},
  {url: 'assets/img/favicon-32x32.png', revision: '09.09.20.2'},
  {url: 'assets/img/favicon-16x16.png', revision: '09.09.20.2'},
  {url: 'assets/img/icons8-menu-48.png', revision: '09.09.20.2'},
  {url: 'assets/vendor/icomoon/style.css', revision: '03.04.21.2'},
  {url: 'assets/vendor/icomoon/fonts/icomoon.ttf', revision: '03.04.21.1'},
  {url: 'assets/vendor/icomoon/fonts/icomoon.woff', revision: '03.04.21.1'},
  {url: 'assets/vendor/sqljs-1.8.0/sql-wasm.js', revision: '10.27.22.1'},
  {url: 'assets/vendor/sqljs-1.8.0/sql-wasm.wasm', revision: '10.27.22.1'},
  {url: 'assets/vendor/localForage-1.10.0/localforage.min.js', revision: '09.15.21.1'},
  {url: 'assets/vendor/leaflet-1.9.4/images/layers.png', revision: '10.27.22.2'},
  {url: 'assets/vendor/leaflet-1.9.4/images/layers-2x.png', revision: '10.27.22.2'},
  {url: 'assets/vendor/leaflet-1.9.4/images/marker-icon.png', revision: '10.27.22.2'},
  {url: 'assets/vendor/leaflet-1.9.4/images/marker-icon-2x.png', revision: '10.27.22.2'},
  {url: 'assets/vendor/leaflet-1.9.4/images/marker-shadow.png', revision: '10.27.22.2'},
  {url: 'assets/vendor/leaflet-1.9.4/leaflet.css', revision: '10.27.22.2'},
  {url: 'assets/vendor/leaflet-1.9.4/leaflet.js', revision: '10.27.22.2'},
  {url: 'assets/vendor/leaflet-locatecontrol-0.79.0/L.Control.Locate.min.css', revision: '05.16.22.2س'},
  {url: 'assets/vendor/leaflet-locatecontrol-0.79.0/L.Control.Locate.js', revision: '05.16.22.2'},
  {url: 'assets/vendor/leaflet-mbtiles/Leaflet.TileLayer.MBTiles.js', revision: '09.09.20.1'},
  {url: 'assets/vendor/leaflet-measure/Leaflet.PolylineMeasure.css', revision: '1'},
  {url: 'assets/vendor/leaflet-measure/Leaflet.PolylineMeasure.js', revision: '1'},
  {url: 'assets/vendor/leaflet-measure/leaflet.measure.css', revision: '2'},
  {url: 'assets/vendor/leaflet-measure/leaflet.measure.js', revision: '2'},
  {url: 'assets/vendor/csv2geojson-5.1.1/csv2geojson.min.js', revision: '03.05.21.1'},
  {url: 'assets/vendor/togeojson-0.16.0/togeojson.min.js', revision: '03.05.21.1'},
], {
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/]
});