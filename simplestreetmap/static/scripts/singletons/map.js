import parseHashCoordinates from '../tools/parseHashCoordinates.js'
import POIsOverlay from '../models/POIsOverlay.js'
import WebsocketClient from '../WebSocketClient.js'

class Map extends maplibregl.Map {
  constructor () {
    console.log('Init map')
    const params = new URLSearchParams(window.location.search)
    const { lng, lat, zoom } = parseHashCoordinates(params.get('map') || '', 1.4436, 43.6042, 13)
    const mapToken = params.get('token')
    
    super({
      container: 'map',
      style: MAP_STYLE_URL,
      center: [lng, lat],
      zoom
    })

    const nav = new maplibregl.NavigationControl()

    const gps = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })

    const scale = new maplibregl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    })

    this.addControl(nav, 'bottom-right')
    this.addControl(gps, 'bottom-right')
    this.addControl(scale)

    this.on('moveend', function () {
      const { lng, lat } = map.getCenter()
      const zoom = map.getZoom()

      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('map', `${zoom}/${lat}/${lng}`)
      history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)
    })

    this.on('load', function () {
      this.loadOverlays()
    })

    this.websocketClient = new WebsocketClient(mapToken)

    this.websocketClient.onMessage('hello', function (data) {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('token', data['map_token'])
      history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)
    })

    this.annotations = {} // itineraries, places, drawings, etc. {annotation_id: annotation}
    this.callbacksOnAnnotationsChange = []
  }

  pushAnnotation (element, userSource = 'self') {
    this.annotations[element.id] = element
    this.callbacksOnAnnotationsChange.forEach(callback => callback('add', element, this.annotations))
    if (userSource === 'self') {
      websocketClient.send({ action: 'add', annotation: element.toJson() })
    }
  }

  removeAnnotation (element, userSource = 'self') {
    delete this.annotations[element.id]
    this.callbacksOnAnnotationsChange.forEach(callback => callback('remove', element, this.annotations))
    if (userSource === 'self') {
      websocketClient.send({ action: 'remove', annotation: element.toJson() })
    }
  }

  onAnnotationsChange (callback) {
    this.callbacksOnAnnotationsChange.push(callback)
  }

  loadOverlays () {
    for (const overlay of OVERLAYS) {
      const overlayObj = new POIsOverlay(overlay)
      overlayObj.saveToAnnotations('overlays')
    }
  }
}

const map = new Map()
export default map
