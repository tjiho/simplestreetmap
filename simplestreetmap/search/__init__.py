import abc

class BaseSearchAdapter(object):
    @abc.abstractmethod
    def search(self, query, lat, lon):
        pass

    @abc.abstractmethod
    def reverse(self, lat, lon):
        pass
