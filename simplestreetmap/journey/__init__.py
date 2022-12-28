import abc

class BaseJourneyAdapter(object):
    @abc.abstractmethod
    def itinerary(self, origin, destination, dateTime=None, mode=None):
        pass