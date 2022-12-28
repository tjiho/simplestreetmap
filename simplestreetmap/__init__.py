from pyramid.config import Configurator
from .search.addok import AddokSearchAdapter
from .journey.navitia import NavitiaJourneyAdapter
from .config import get_config
from .views import (
    search_view,
    index_view,
    itinerary_view,
)

__version__ = '0.1'

def make_app():
    ssm_config = get_config()
    search_adapter = AddokSearchAdapter(ssm_config['search']['addok'])
    journey_adapter = NavitiaJourneyAdapter()

    with Configurator() as config:
        config.include('pyramid_jinja2')
        config.add_jinja2_search_path('templates')
        config.add_static_view('static', 'static')

        config.add_route('search', '/api/v1/search')
        config.add_route('itinerary', '/api/v1/itinerary')
        config.add_route('index', '/')

        config.add_view(search_view, route_name='search', request_method='GET', renderer='json')
        config.add_view(itinerary_view, route_name='itinerary', request_method='GET', renderer='json')
        config.add_view(index_view, route_name='index', request_method='GET', renderer='index.jinja2')

        config.add_request_method(lambda request: search_adapter, 'search_adapter', reify=True)
        config.add_request_method(lambda request: journey_adapter, 'journey_adapter', reify=True)
        config.add_request_method(lambda request: ssm_config, 'ssm_config', reify=True)
        app = config.make_wsgi_app()
    return app
