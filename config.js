const BASE_MAP_URL = "https://static.ppsfleet.navy/osm-data/beta.json";

const BASE_SEARCH_URL = (query, lat, lng) =>
  `https://search.maps.ppsfleet.navy/search/?q=${query}&lat=${lat}&lon=${lng}`;

const BASE_REVERSE_URL = (lat, lng) =>
  `https://search.maps.ppsfleet.navy/reverse?lat=${lat}&lon=${lng}`;
