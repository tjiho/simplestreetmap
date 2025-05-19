def get_config():
    return {
        'general': {
            'map_style_url': 'https://static.ppsfleet.navy/osm-data/styles/generic-latest.json',
            'websocket_url': 'ws://127.0.0.1:8765',
        },
        'overlays': [
            {
                'tiles_url': 'https://tiles.maps.ppsfleet.navy',
                'source_layer': 'public.cameras',
                'name': 'cameras'
            }
        ],
        'search': {
            'addok': {
                'url': 'https://search.maps.ppsfleet.navy'
            }
        },
        'maplibre': {
            'js': {
                'url': 'https://static.ppsfleet.navy/js/maplibre-5.5.0.js',
                'url_pmtiles': 'https://static.ppsfleet.navy/js/pmtiles-4.3.0.js'
            },
            'css': {
                'url': 'https://static.ppsfleet.navy/js/maplibre-5.5.0.css'
            }
        }
    }
