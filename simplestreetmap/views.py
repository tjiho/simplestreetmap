def search_view(request):
    if not request.params.get('q', ''):
        return []

    return request.search_adapter.search(request.params['q'])

def index_view(request):
    return {}
