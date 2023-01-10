import map from '../singletons/map.js'

export default class Journey {
  constructor ({ name, from, to, mode, color = null, distances, sections, duration, path }) {
    this.id = crypto.randomUUID()
    this.objectType = 'journey'
    this.name = from.placeName + ' - ' + to.placeName
    this.from = from
    this.to = to
    this.mode = mode
    this.color = color
    this.distances = distances
    this.duration = duration
    this.sections = sections
    this.path = this.mergePath()
    this.alternatives = [] // other journeys return by the api for the same itinerary
    this.addSource()
  }

  mergePath () {
    return {
      type: 'FeatureCollection',
      features: this.sections.map((section) => ({
        type: 'Feature',
        geometry: section.path
      }))
    }
  }

  addSource () {
    map.addSource(this.id, { type: 'geojson', data: this.path })
  }

  setColor (color) {
    this.color = color
    map.setPaintProperty(
      this.id,
      'line-color',
      color
    )
  }

  moveOnTop () {
    map.moveLayer(this.id)
  }

  show () {
    // TODO: mettre le layer des noms de villes au dessus
    map.addLayer({
      id: this.id,
      type: 'line',
      source: this.id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': this.color,
        'line-width': 4,
        'line-opacity': 1
      }
    })
  }

  hide () {
    map.removeLayer(this.id)
  }

  destroy () {
    map.removeSource(this.id)
  }

  saveToAnnotations () {
    map.pushAnnotations(this)
  }
}
