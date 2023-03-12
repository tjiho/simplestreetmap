def get_config():
    return {
        'general': {
            'map_style_url': 'https://maps.ppsfleet.navy/tileserver-data/qwant-basic-gl-style-toulouse/built-style-debug.json',
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
                'url': 'https://static.ppsfleet.navy/js/maplibre-2.4.0.js'
            },
            'css': {
                'url': 'https://static.ppsfleet.navy/js/maplibre-2.4.0.css'
            } 
        }
    }
