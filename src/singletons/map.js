import parseHashCoordinates from '../tools/parseHashCoordinates.js'

class Map extends mapboxgl.Map {
  constructor () {
    console.log('Init map')
    const params = new URLSearchParams(window.location.search)
    const { lng, lat, zoom } = parseHashCoordinates(params.get('map') || '', 1.4436, 43.6042, 13)

    super({
      container: 'map',
      style: BASE_MAP_URL,
      center: [lng, lat],
      zoom: zoom
    })

    const nav = new mapboxgl.NavigationControl()

    const gps = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })

    const scale = new mapboxgl.ScaleControl({
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
  }
}

const map = new Map()
export default map
