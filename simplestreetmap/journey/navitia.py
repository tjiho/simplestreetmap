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
                    instructions: []
                    elevations: []
                }]
            }]
        '''
        res = []
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
                curr_journey['sections'].append(curr_section)
            res.append(curr_journey)
        return res