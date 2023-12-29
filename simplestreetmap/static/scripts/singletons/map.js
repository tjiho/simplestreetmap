import { render, html } from '../../../static/vendor/preact/standalone.module.js'

import parseHashCoordinates from '../tools/parseHashCoordinates.js'
import POIsOverlay from '../models/POIsOverlay.js'
import websocketClient from './webSocketClient.js'
import annotationStore from '../singletons/annotationsStore.js'
import ContextMenu from '../components/ContextMenu.js'

class Map {
  constructor () {
    this.isinitiated = false
    this.userId = null
    this.map = null
  }

  getMap () {
    return this.map
  }

  initMap (container) {
    console.log('Init map')
    const params = new URLSearchParams(window.location.search)
    const { lng, lat, zoom } = parseHashCoordinates(params.get('map') || '', 1.4436, 43.6042, 13)
    const mapToken = params.get('token')

    this.map = new maplibregl.Map({
      container,
      style: MAP_STYLE_URL,
      center: [lng, lat],
      zoom,
      pitch: 40
    })

    const self = this

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

    this.map.addControl(nav, 'bottom-right')
    this.map.addControl(gps, 'bottom-right')
    this.map.addControl(scale)

    this.map.on('moveend', this.moveEnd.bind(this))

    this.map.on('load', () => {
      self.loadOverlays.bind(this)
      websocketClient.init(mapToken)
    })

    this.map.on('click', this.onClick.bind(this))
  }

  moveEnd () {
    const { lng, lat } = this.getMap().getCenter()
    const zoom = this.getMap().getZoom()

    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('map', `${zoom}/${lat}/${lng}`)
    history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)
  }

  onClick (e) {
    const popup = new maplibregl.Popup({
      className: 'Mypopup'
      // closeButton: false
      // closeOnClick: false,
    })

    const coordinates = e.lngLat.toArray()

    const tooltipNode = document.createElement('div')

    render(html`<${ContextMenu} coordinates=${coordinates} currentPopup=${popup} canEdit=${websocketClient.canEdit} local=${websocketClient.isLocal}/>`, tooltipNode)

    popup
      .setLngLat(e.lngLat)
      .setDOMContent(tooltipNode)
      .addTo(this.getMap())
  }

  loadOverlays () {
    for (const overlay of OVERLAYS) {
      const overlayObj = new POIsOverlay(overlay)
      annotationStore.addLocalAnnotation(overlayObj, { sendToServer: false })
    }
  }
}

const map = new Map()

export default map
