import map from '../singletons/map.js'
import AbstractAnnotation from "./AbstractAnnotation.js";

export default class Place extends AbstractAnnotation {
  constructor ({ lat, lng, name }) {
    super()
    this.lat = lat
    this.lng = lng
    this.name = name

    this.objectType = 'place'

    this.show()
    this.saveToAnnotations()
  }

  moveOnTop () {
    map.moveLayer(this.id)
  }

  show () {
    this.marker = new mapboxgl.Marker({ color: '#69369B' })
      .setLngLat([this.lng, this.lat])
      .addTo(map)
  }

  hide () {
    this?.marker?.remove()
  }

  destroy () {
    this?.marker?.remove()
  }
}
