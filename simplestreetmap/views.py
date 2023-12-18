def search_view(request):
    if not request.params.get('q', ''):
        return []

    return request.search_adapter.search(request.params['q'])

def reverse_view(request):
    if not request.params.get('lat', '') or not request.params.get('lon', ''):
        return []
    return request.search_adapter.reverse(request.params['lat'], request.params['lon'])

def itinerary_view(request):
    if not request.params.get('from', '') or not request.params.get('to', ''):
        return []

    mode = request.params.get('mode','bike')
    if mode == 'public_transport':
        return request.navitia_adapter.itinerary(
            request.params['from'].split(',')[0],
            request.params['from'].split(',')[1],
            request.params['to'].split(',')[0],
            request.params['to'].split(',')[1]
        )
    elif mode == 'bike':
        return request.brouter_adapter.itinerary(
            request.params['from'].split(',')[0],
            request.params['from'].split(',')[1],
            request.params['to'].split(',')[0],
            request.params['to'].split(',')[1],
            profile='trekking'
        )
    elif mode == 'walk':
            return request.brouter_adapter.itinerary(
                request.params['from'].split(',')[0],
                request.params['from'].split(',')[1],
                request.params['to'].split(',')[0],
                request.params['to'].split(',')[1],
                profile='walking'
            )
    elif mode == 'camera':
            return request.brouter_adapter.itinerary(
                request.params['from'].split(',')[0],
                request.params['from'].split(',')[1],
                request.params['to'].split(',')[0],
                request.params['to'].split(',')[1],
                profile='camera'
            )

def index_view(request):
    return {}
