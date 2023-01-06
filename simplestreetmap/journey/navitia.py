import requests

from . import BaseJourneyAdapter

class NavitiaJourneyAdapter(BaseJourneyAdapter):
    def __init__(self):
        self.url = 'https://api.navitia.io/v1/journeys'
        self.token = '2b515b9b-846a-4ad5-9419-66e1f1832a83'
    
    def itinerary(self, origin, destination, dateTime=None, mode=None):
        print('Requesting navitia...')
        response = requests.get(self.url, params = {'from': origin, 'to':destination, 'key':self.token }).json()
        print('Navitia response received')
        '''
            [{
                path: geoJSON
                duration: time in seconds
                distances: distance in meters
                co2_emissions: co2 emissions in grams
                sections: [{
                    path: geoJSON
                    duration: time in seconds
                    distances: distance in meters
                    co2_emissions: co2 emissions in grams
                    mode: oneOf('public_transport','walking','bike','car','taxi','ridesharing')
                    departure_time: datetime(yyyymmddThhmmss)
                    instructions: []
                    elevations: []
                    from: {
                        name,
                        coord: [lat,lon],
                    }
                    to : {
                        name,
                        coords: [lat,lon]
                    }
                    // if public_transport
                    transport_info: {
                        type: oneOf('metro','bus',train')
                        network: 'Toulouse - tisseo'
                        direction: name (ex: Ramonville (Ramonville-Saint-Agne))
                        line_name: lineo 4 or A or TER/TGV or 65
                        line_bg_color: color (ex: FFDD00)
                        line_text_color: color
                    }
                }]
            }]
        '''
        res = []

        if not 'journeys' in response:
            return [] # TODO: return 404 instead
        
        for journey in response['journeys']:
            curr_journey = {}
            curr_journey['distances'] = journey['distances']
            curr_journey['duration'] = journey['duration']
            curr_journey['sections'] = []
            for section in journey['sections']:
                curr_section = {}
                if 'geojson' in section:
                    curr_section['path'] = section['geojson']
                if 'duration' in section:
                    curr_section['duration'] = section['duration']
                if 'distances' in section:
                    curr_section['distances'] = section['distances']
                if 'path' in section:
                    curr_section['instructions'] = section['path']
                if 'elevations' in section:
                    curr_section['elevations'] = section['elevations']                
                if 'mode' in section:
                    curr_section['mode'] = section['mode']
                if 'from' in section:
                    curr_section['from'] = self.parse_place(section['from'])
                if 'to' in section:
                    curr_section['to'] = self.parse_place(section['to'])

                curr_section['mode'] = self.getMode(section)
                if curr_section['mode'] == 'public_transport':
                    curr_section['transport_info'] = self.parse_transport_info(section)

                curr_journey['sections'].append(curr_section)


            res.append(curr_journey)
        return res

    def parse_place(self,navitia_place):
        res = {}
        if 'name' in navitia_place:
            res['name'] = navitia_place['name']

        if 'address' in navitia_place:
            res['coord'] = navitia_place['address']['coord']
        elif 'stop_point' in navitia_place:
            res['coord'] = navitia_place['stop_point']['coord']

        return res

    def getMode(self,navitia_section):
        if 'mode' in navitia_section:
            return navitia_section['mode']
        elif 'links' in navitia_section:
            return 'public_transport'

    def getDepartureTime(self,navitia_section):
        if 'departure_date_time' in navitia_section:
            return navitia_section['departure_date_time']

    def parse_transport_info(self,navitia_section):
        if 'display_informations' in navitia_section:
            return {
                'type': navitia_section['display_informations']['physical_mode'],
                'network': navitia_section['display_informations']['network'],
                'direction': navitia_section['display_informations']['direction'],
                'line_name': navitia_section['display_informations']['code'],
                'line_bg_color': navitia_section['display_informations']['color'],
                'line_text_color': navitia_section['display_informations']['text_color']
            }
