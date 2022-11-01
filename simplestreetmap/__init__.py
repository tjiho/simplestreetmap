from pyramid.config import Configurator

from .views import (
    test_view,
)

__version__ = '0.1'

def make_app():
    with Configurator() as config:
        config.add_route('test', '/test')
        config.add_view(test_view, route_name='test', request_method='GET', renderer='json')
        app = config.make_wsgi_app()
    return app
