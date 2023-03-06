import map from '../singletons/map.js'
import AbstractAnnotation from "./AbstractAnnotation.js";

export default class Journey extends AbstractAnnotation {
  constructor ({ name, from, to, mode, color = null, distances, sections, duration, path }) {
    super()
    this.objectType = 'journey'
    this.name = from.name + ' - ' + to.name
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

    this.visible = true
    return this.visible
  }

  hide () {
    map.removeLayer(this.id)
    this.visible = false
    return this.visible
  }

  destroy () {
    map.removeSource(this.id)
  }
}
