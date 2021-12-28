BASE_MAP_URL = 'https://maps.ppsfleet.navy/tileserver-data/qwant-basic-gl-style-toulouse/built-style-debug.json'

BASE_SEARCH_URL = (query) => `https://search.maps.ppsfleet.navy/search/?q=${query}`

BASE_REVERSE_URL = (lat,lng) => `https://search.maps.ppsfleet.navy/reverse?lat=${lat}&lon=${lng}`
