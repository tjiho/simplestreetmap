import map from '../singletons/map.js'
import AbstractAnnotation from './AbstractAnnotation.js'

export default class Place extends AbstractAnnotation {
  constructor ({ lat, lng, name, context }) {
    super()
    this.lat = lat
    this.lng = lng
    this.name = name
    this.context = context

    this.objectType = 'place'

    this.show()
    this.saveToAnnotations()
  }

  moveOnTop () {
    map.moveLayer(this.id)
  }

  show () {
    this.marker = new maplibregl.Marker({ color: '#69369B' })
      .setLngLat([this.lng, this.lat])
      .addTo(map)
    this.visible = true
    return this.visible
  }

  hide () {
    this?.marker?.remove()
    this.visible = false
    return this.visible
  }

  destroy () {
    this?.marker?.remove()
  }

  zoomOn () {
    map.flyTo({ center: [this.lng, this.lat], zoom: 13 })
  }

  toJson () {
    return {
      lat: this.lat,
      lng: this.lng,
      name: this.name,
      context: this.context,
      objectType: this.objectType
    }
  }
}
