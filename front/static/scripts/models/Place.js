import map from '../singletons/map.js'
import AbstractAnnotation from './AbstractAnnotation.js'

export default class Place extends AbstractAnnotation {
  constructor ({ lat, lng, name, context }, source = 'self', serverId = null) {
    super()
    this.lat = lat
    this.lng = lng
    this.name = name
    this.context = context
    this.serverId = serverId
    this.objectType = 'place'

    this.show()
    // this.saveToAnnotations(source)
  }

  moveOnTop () {
    map.getMap().moveLayer(this.id)
  }

  show () {
    this.marker = new maplibregl.Marker({ color: '#69369B' })
      .setLngLat([this.lng, this.lat])
      .addTo(map.getMap())
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
    map.getMap().flyTo({ center: [this.lng, this.lat], zoom: 13 })
  }

  update(newAnnotationFields) {
    if(newAnnotationFields.name) {
      this.name = newAnnotationFields.name
    }
  }

  toJson () {
    return {
      id: this.id,
      lat: this.lat,
      lng: this.lng,
      name: this.name,
      context: this.context,
      object_type: this.objectType
    }
  }
}
