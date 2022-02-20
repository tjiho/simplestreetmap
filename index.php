<!DOCTYPE html>
<html>
<head>
    <?php
      $coordinates = htmlspecialchars($_GET['map']);
    ?>

    <meta charset='utf-8' />
    <title>Maps.ppsfleet.navy</title>
    <meta property="og:image" content="<?= "https://maps.ppsfleet.navy/toulouse/preview.php?map=".$coordinates?>" />
    <meta property="og:image:width" content="600"/>
    <meta property="og:image:height" content="400"/>
    <meta property="og:image:type" content="image/png">
    <meta property="twitter:image" content="<?= "https://maps.ppsfleet.navy/toulouse/preview.php?map=".$coordinates?>" />
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:title" content="Maps.ppsfleet.navy"/>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <!-- mapbox -->
    <script src='https://maps.ppsfleet.navy/maplibre/mapbox-gl-unminified.js'></script>
    <link href='https://maps.ppsfleet.navy/maplibre/mapbox-gl.css' rel='stylesheet' />
    <!-- css -->
    <link href='https://static.ppsfleet.navy/fonts/russisch-sans/style.css' rel='stylesheet' />
    <link href='./src/css/style.css' rel='stylesheet' />
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
      <div class="search-container__top">
        <label class="search-label" for="search-input">
          <img src="./static/images/helium/search.svg" id="search-button" class="search-label__icon"/>
          <input type="search" placeholder="search..." id="search-input" class="search-label__input"/>
        </label>
        <div id="places">
        </div>
      </div>
      <div id="search-results">
      </div>
      <div class="search-container__bottom">
        <button id="search-close-button">Fermer la recherche</button>
      </div>
    </div>
    
    <nav id="categories">
    </nav>

    <!-- todo: add a contextmenu -->

    <script type="module">
      import search from './src/singletons/search.js'
      import map from './src/singletons/map.js'

      import PlaceComponent from './src/components/PlaceComponent.js'
      customElements.define('c-place', PlaceComponent)

    </script>

    <?php
      include "src/components/ChipBaseTemplate.php";
    ?>
</body>
</html>
