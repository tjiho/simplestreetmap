from pyramid.config import Configurator
from .search.addok import AddokSearchAdapter
from .config import get_config
from .views import (
    search_view,
)

__version__ = '0.1'

def make_app():
    ssm_config = get_config()
    search_adapter = AddokSearchAdapter(ssm_config['search']['addok'])


    with Configurator() as config:
        config.add_route('search', '/api/v1/search')
        config.add_view(search_view, route_name='search', request_method='GET', renderer='json')
        config.add_request_method(lambda request: search_adapter, 'search_adapter', reify=True)
        app = config.make_wsgi_app()
    return app
