def get_config():
    return {
        'general': {
            'map_style_url': 'https://maps.ppsfleet.navy/tileserver-data/qwant-basic-gl-style-toulouse/built-style-debug.json',
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
                'url': 'https://static.ppsfleet.navy/js/maplibre-3.6.2.js'
            },
            'css': {
                'url': 'https://static.ppsfleet.navy/js/maplibre-3.6.2.css'
            } 
        }
    }
