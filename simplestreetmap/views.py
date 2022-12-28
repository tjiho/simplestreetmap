def search_view(request):
    if not request.params.get('q', ''):
        return []

    return request.search_adapter.search(request.params['q'])

def itinerary_view(request):
    if not request.params.get('from', '') or not request.params.get('to', ''):
        return []
    return request.journey_adapter.itinerary(request.params['from'].replace(',',';'), request.params['to'].replace(',',';'))

def index_view(request):
    return {}
