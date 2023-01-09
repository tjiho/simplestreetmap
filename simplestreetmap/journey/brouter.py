import requests

from . import BaseJourneyAdapter

class BrouterJourneyAdapter(BaseJourneyAdapter):
    def __init__(self):
        self.url = 'https://brouter.maps.ppsfleet.navy'
        self.token = '2b515b9b-846a-4ad5-9419-66e1f1832a83'

    def itinerary(self, origin_lon, origin_lat, destination_lon, destination_lat, dateTime=None, mode=None):
        print('Requesting Brouter...')
        lonlats="%s,%s|%s,%s" % (origin_lon, origin_lat, destination_lon, destination_lat)
        response = requests.get(self.url, params = {'profile':'fastbike','lonlats': lonlats,'format':'geojson','alternativeidx':0 }).json()
        print('Brouter response received')

        if not 'features' in response:
            return [] # TODO: return 404 instead

        journey = response['features'][0]

        curr_journey = {}
        curr_journey['distances'] = journey['properties']['track-length']
        curr_journey['duration'] = journey['properties']['total-time']
        curr_journey['sections'] = [
            {
                'path': journey['geometry'],
                'duration': journey['properties']['total-time'],
                'distances': journey['properties']['track-length'],
                'mode': 'bike'
            }
        ]

        return [curr_journey]
