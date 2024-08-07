import requests
import datetime

from . import BaseJourneyAdapter

class BrouterJourneyAdapter(BaseJourneyAdapter):
    def __init__(self):
        self.url = 'https://brouter.maps.ppsfleet.navy'
        self.token = '2b515b9b-846a-4ad5-9419-66e1f1832a83'

    def itinerary(self, origin_lon, origin_lat, destination_lon, destination_lat, profile='trekking', dateTime=None, mode=None):
        print('Requesting Brouter...')
        lonlats="%s,%s|%s,%s" % (origin_lon, origin_lat, destination_lon, destination_lat)
        try:
            response = requests.get(self.url, params = {'profile':profile,'lonlats': lonlats,'format':'geojson','alternativeidx':0 }).json()
        except:
            return []
 
        print('Brouter response received')

        if not 'features' in response:
            return [] # TODO: return 404 instead

        journey = response['features'][0]

        curr_journey = {}
        curr_journey['distances'] = journey['properties']['track-length']
        curr_journey['duration'] = journey['properties']['total-time']
        curr_journey['plain-ascend'] = journey['properties'].get('plain-ascend',0)
        curr_journey['filtered ascend'] = journey['properties'].get('filtered ascend',0)
        curr_journey['messages'] = journey['properties'].get('messages',[])


        departure_time = datetime.datetime.now()
        arrival_time = departure_time + datetime.timedelta(seconds=int(journey['properties']['total-time']))
        curr_journey['sections'] = [
            {
                'path': journey['geometry'],
                'duration': journey['properties']['total-time'],
                'distances': journey['properties']['track-length'],
                'mode': 'bike',
                'departure_time': departure_time.strftime("%Y-%m-%dT%H:%M:%S"),
                'arrival_time': arrival_time.strftime("%Y-%m-%dT%H:%M:%S")
            }
        ]

        return [curr_journey]
