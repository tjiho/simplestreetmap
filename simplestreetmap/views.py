def search_view(request):
    # TODO: remove this once index is served by server
    request.response.headers.update({
        'Access-Control-Allow-Origin': '*',
    })

    if not request.params.get('q', ''):
        return []

    return request.search_adapter.search(request.params['q'])

def index_view(request):
    return {}
