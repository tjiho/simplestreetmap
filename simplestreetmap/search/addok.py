import requests

from . import BaseSearchAdapter

class AddokSearchAdapter(BaseSearchAdapter):
    def __init__(self, config):
        self.url = config['url']

    def search(self, query):
        response = requests.get(f'{self.url}/search', params = { 'q': query }).json()
        result = []
        for feature in response['features']:
            feature_name = feature['properties']['name']
            feature_type = feature['properties']['type']
            if feature_type in ('city', 'town', 'village'):
                context = ['postcode', 'region']
            else:
                context = ['city', 'postcode', 'context']

            feature_context = [
                feature['properties'][item]
                for item in context if item in feature['properties']
            ]
            feature_coord = feature['geometry']['coordinates']

            result.append({
                'name': feature_name,
                'type': feature_type,
                'coord': feature_coord,
                'context': feature_context,
            })

        return result

    def reverse(self, lat, long):
        pass
