import map from '../singletons/map.js'

export default class Place {
  constructor ({ lat, lng, name }) {
    this.id = crypto.randomUUID()
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
    map.removeSource(this.id)
  }

  saveToAnnotations () {
    map.pushAnnotations(this)
  }
}
