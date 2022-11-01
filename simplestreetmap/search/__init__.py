import abc

class BaseSearchAdapter(object):
    @abc.abstractmethod
    def search(self, query):
        pass

    @abc.abstractmethod
    def reverse(self, lat, long):
        pass
