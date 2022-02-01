<!DOCTYPE html>
<html>
<head>
    <?php
      $coordinates = htmlspecialchars($_GET['map']);
    ?>

    <meta charset='utf-8' />
    <title>Maps.ppsfleet.navy</title>
    <meta property="og:image" content="<?= "https://maps.ppsfleet.navy/toulouse/preview.php?map=".$coordinates?>" />
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <meta property="og:image" content="./anemone.jpg">
    <!-- mapbox -->
    <script src='https://maps.ppsfleet.navy/maplibre/mapbox-gl-unminified.js'></script>
    <link href='https://maps.ppsfleet.navy/maplibre/mapbox-gl.css' rel='stylesheet' />
    <!-- css -->
    <link href='./static/css/style.css' rel='stylesheet' />
    <!-- config -->
    <script src='./config.js'></script>
    <style>
      body { margin:0; padding:0; }
      #map { position:absolute; top:0; bottom:0; width:100%; }
    </style>
</head>
<body>
    <div id='map'></div>
    <div id="search-container">
      <label class="search-label" for="search-input">
        <img src="./static/images/helium/search.svg" class="search-label__icon"/>
        <input type="search" placeholder="search..." id="search-input" class="search-label__input"/>
      </label>
      <div id="search-results">
      </div>
    </div>
    <div id="places"></div>
    <nav id="categories">
    </nav>

    <!-- todo: add a contextmenu -->

    <script type="module">
      import { parseHashCoordinates } from './static/js/tools/parseHashCoordinates.js'
      import { Search } from './static/js/Search.js'
      import { Place } from './static/js/Place.js'
      import { BaseChipComponent } from './static/js/components/BaseChipComponent.js'

      customElements.define('base-chip', BaseChipComponent)

      let params = new URLSearchParams(window.location.search);
      const {lng, lat, zoom} = parseHashCoordinates(params.get("map") || '', 1.4436, 43.6042, 13)

      var map = new mapboxgl.Map({
        container: 'map',
        style: BASE_MAP_URL,
        center: [lng, lat],
        zoom: zoom,
      });

      var nav = new mapboxgl.NavigationControl();

      var gps = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })

      var scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      });

      const search = new Search(map)

      map.addControl(nav, 'bottom-right');
      map.addControl(gps, 'bottom-right');
      map.addControl(scale);

      map.on('load', function() {

      });

      map.on('contextmenu', function(e) {
        new Place(map, e.lngLat.lat, e.lngLat.lng)
      })

      map.on('moveend', function() {
        const {lng, lat} = map.getCenter();
        const zoom = map.getZoom();
        const hash = `map=${zoom}/${lat}/${lng}`
        history.replaceState(null, null, `${document.location.pathname}?${hash}`);
      });
    </script>

    <template id="template-base-chip">
      <div class="chip_delete">
        <img src="./static/images/breeze/edit-delete-black.svg" class="icon--medium icon--white"/>
      </div>
      <div class="chip__name">
        <slot name="name">empty</slot>
      </div>
      <div class="chip__actions">
        <slot name="actions"></slot>
      </div>
      <link href='./static/css/chip.css' rel='stylesheet' />
    </template>
</body>
</html>
