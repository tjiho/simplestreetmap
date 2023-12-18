import { render, html } from '../../../static/vendor/preact/standalone.module.js'

import parseHashCoordinates from '../tools/parseHashCoordinates.js'
import POIsOverlay from '../models/POIsOverlay.js'
import Place from '../models/Place.js'
import WebsocketClient from '../WebSocketClient.js'

import ContextMenu from '../components/ContextMenu.js'

class Map {
  constructor () {
    this.isinitiated = false

    this.localAnnotations = {} // itineraries, places, drawings, etc. {annotation_id: annotation}
    this.syncAnnotations = {}
    this.callbacksOnAnnotationsChange = []
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
      pitch: 30
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

    this.map.on('load', this.loadOverlays.bind(this))

    this.map.on('click', this.onClick.bind(this))

    this.websocketClient = new WebsocketClient(mapToken)

    this.websocketClient.onMessage('hello', function (data) {
      console.log('hello from websocket')
      self.userId = data.user_id
      console.log(self.userId)
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('token', data.map_token)
      console.log(searchParams)
      history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)

      if (data?.places) {
        data.places.forEach(place => {
          new Place(place, 'init')
        })
      }
    })

    this.websocketClient.onMessage('add', function (data) {
      console.log('add', data)
      const serverId = data.uuid
      const localId = data.annotation.id
      const userId = data.user_id
      if (userId === self.userId) {
        const localAnnotation = self.localAnnotations[localId]
        localAnnotation.backendId = serverId
        self.syncAnnotations[serverId] = localAnnotation
        delete self.localAnnotations[localId]
      } else {
        new Place(data.annotation, userId, serverId)
      }
      // si source == self et que annotation.id est dans dans nos données locales => supprimer des données locales
      // creer annotation[data.uuid] avec annotation du bon type
    })
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

    render(html`<${ContextMenu} coordinates=${coordinates} currentPopup=${popup}/>`, tooltipNode)

    popup
      .setLngLat(e.lngLat)
      .setDOMContent(tooltipNode)
      .addTo(this.getMap())
  }

  pushAnnotation (element, userSource = 'self') {
    console.log(userSource)
    if (userSource === 'self') {
      this.localAnnotations[element.id] = element
      console.log('send to websocket')
      this.websocketClient.send({ action: 'add_annotation', annotation: element.toJson() })
    } else {
      this.syncAnnotations[element.serverId] = element
    }
    this.notifyAnnotationsChange('add', element)
  }

  removeAnnotation (element, userSource = 'self') {
    delete this.localAnnotations[element.id]
    delete this.syncAnnotations[element.id]
    this.notifyAnnotationsChange('remove', element)
    if (userSource === 'self') {
      this.websocketClient.send({ action: 'remove_annotation', annotation: element.toJson() })
    }
  }

  notifyAnnotationsChange (action, annotation) {
    this.callbacksOnAnnotationsChange.forEach(callback => callback(action, annotation, { ...this.localAnnotations, ...this.syncAnnotations }))
  }

  onAnnotationsChange (callback) {
    this.callbacksOnAnnotationsChange.push(callback)
  }

  loadOverlays () {
    for (const overlay of OVERLAYS) {
      const overlayObj = new POIsOverlay(overlay)
      overlayObj.saveToAnnotations('overlays')
    }

    // map.addSource("Batiments", {
    //   type: "geojson",
    //   data:
    //     "https://raw.githubusercontent.com/mastersigat/data/main/BatiRennes.geojson",
    // });

    // map.addLayer({
    //   id: "Batiments",
    //   type: "fill-extrusion",
    //   source: "Batiments",
    //   paint: {
    //     "fill-extrusion-height": { type: "identity", property: "HAUTEUR" },
    //     "fill-extrusion-color": {
    //       property: "HAUTEUR",
    //       stops: [
    //         [5, "#1a9850"],
    //         [7, "#91cf60"],
    //         [9, "#d9ef8b"],
    //         [12, "#ffffbf"],
    //         [16, "#fee08b"],
    //         [20, "#fc8d59"],
    //         [30, "#d73027"],
    //       ],
    //     },
    //     "fill-extrusion-opacity": 0.7,
    //     "fill-extrusion-base": 0,
    //   },
    // });
  }
}

const map = new Map()

export default map
