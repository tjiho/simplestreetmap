import requests

from . import BaseSearchAdapter

class AddokSearchAdapter(BaseSearchAdapter):
    def __init__(self, config):
        self.url = config['url']

    def search(self, query):
        response = requests.get(f'{self.url}/search', params = { 'q': query }).json()
        result = []
        for feature in response['features']:
            result.append(result_from_feature(feature))

        return result

    def reverse(self, lat, long):
        response = requests.get(f'{self.url}/reverse', params = { 'lon': long, 'lat': lat }).json()
        if len(response['features']) == 0:
            return {
                'name': 'Unknown',
                'type': 'Unknown',
                'coord': [long, lat],
                'context': []
            }
        else:
            return result_from_feature(response['features'][0])


def result_from_feature(feature):
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

    return {
        'name': feature_name,
        'type': feature_type,
        'coord': feature_coord,
        'context': feature_context,
    }