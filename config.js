// Default map view (used when no ?map=lng/lat/zoom is in the URL).
const DEFAULT_CENTER = [1.4436, 43.6042]; // [lng, lat]
const DEFAULT_ZOOM = 13;

// Base map style.
const BASE_MAP_URL = "https://static.ppsfleet.navy/osm-data/beta.json";

// Per-layer tile / source URLs (esquisse falls back to its own defaults if omitted).
const POI_TILES_URL = "pmtiles://https://static.ppsfleet.navy/osm-data/poi.pmtiles";
const BICYCLE_TILES_URL = "pmtiles://https://static.ppsfleet.navy/osm-data/velo.pmtiles";
const BICYCLE_BASE_STYLE_URL = "https://static.ppsfleet.navy/osm-data/styles/positron.json";
const SATELLITE_TILES_URL =
  "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
  "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg" +
  "&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";
const BATIMENT3D_TILES_URL =
  "https://data.geopf.fr/tms/1.0.0/BDTOPO/{z}/{x}/{y}.pbf";

// Search / reverse / overpass endpoints.
const BASE_SEARCH_URL = (query, lat, lng) =>
  `https://search.maps.ppsfleet.navy/search/?q=${query}&lat=${lat}&lon=${lng}`;

const BASE_REVERSE_URL = (lat, lng) =>
  `https://search.maps.ppsfleet.navy/reverse?lat=${lat}&lon=${lng}`;

const BASE_OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";
