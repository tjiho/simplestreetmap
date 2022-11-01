def search_view(request):
    # TODO: remove this once index is served by server
    request.response.headers.update({
            'Access-Control-Allow-Origin': '*',
        })

    return request.search_adapter.search(request.params['q'])
