import abc

class BaseJourneyAdapter(object):
    @abc.abstractmethod
    def itinerary(self, origin_lon, origin_lat, destination_lon, destination_lat, dateTime=None, mode=None):
        '''
            [{
                duration: time in seconds
                distances: distance in meters or {
                    walking: distance,
                    bike: distance,
                    taxi: distance,
                    ...
                }
                co2_emissions: co2 emissions in grams
                sections: [{
                    path: geoJSON --REQUIRED--
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
        pass