import datetime

import requests

from . import BaseJourneyAdapter


class NavitiaJourneyAdapter(BaseJourneyAdapter):
    def __init__(self):
        self.url = 'https://api.navitia.io/v1/journeys'
        self.token = '2b515b9b-846a-4ad5-9419-66e1f1832a83'

    def itinerary(self, origin_lon, origin_lat, destination_lon, destination_lat, dateTime=None, mode=None):
        print('Requesting navitia...')
        origin = "%s;%s" % (origin_lon, origin_lat)
        destination = "%s;%s" % (destination_lon, destination_lat)
        response = requests.get(self.url, params={'from': origin, 'to': destination, 'key': self.token}).json()
        print('Navitia response received')

        res = []

        if not 'journeys' in response:
            return []  # TODO: return 404 instead

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

                curr_section['mode'] = self.get_mode(section)
                if curr_section['mode'] == 'public_transport':
                    curr_section['transport_info'] = self.parse_transport_info(section)
                curr_section['departure_time'] = self.get_departure_time(section)
                curr_section['arrival_time'] = self.get_arrival_time(section)
                curr_journey['sections'].append(curr_section)

            res.append(curr_journey)
        return res

    def parse_place(self, navitia_place):
        res = {}
        if 'name' in navitia_place:
            res['name'] = navitia_place['name']

        if 'address' in navitia_place:
            res['coord'] = navitia_place['address']['coord']
        elif 'stop_point' in navitia_place:
            res['coord'] = navitia_place['stop_point']['coord']

        return res

    def get_mode(self, navitia_section):
        if 'mode' in navitia_section:
            return navitia_section['mode']
        elif 'links' in navitia_section:
            return 'public_transport'

    def get_departure_time(self, navitia_section):
        if 'departure_date_time' in navitia_section:
            departure = datetime.datetime.strptime(navitia_section['departure_date_time'], "%Y%m%dT%H%M%S")
            return departure.strftime("%Y-%m-%dT%H:%M:%S")

    def get_arrival_time(self, navitia_section):
        if 'departure_date_time' in navitia_section and 'duration' in navitia_section:
            arrival = datetime.datetime.strptime(
                navitia_section['departure_date_time'],
                "%Y%m%dT%H%M%S"
            ) + datetime.timedelta(seconds=navitia_section['duration'])
            return arrival.strftime("%Y-%m-%dT%H:%M:%S")

    def parse_transport_info(self, navitia_section):
        if 'display_informations' in navitia_section:
            return {
                'type': navitia_section['display_informations']['physical_mode'],
                'network': navitia_section['display_informations']['network'],
                'direction': navitia_section['display_informations']['direction'],
                'line_name': navitia_section['display_informations']['code'],
                'line_bg_color': navitia_section['display_informations']['color'],
                'line_text_color': navitia_section['display_informations']['text_color']
            }
