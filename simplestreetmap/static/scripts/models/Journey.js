import map from '../singletons/map.js'
import AbstractAnnotation from './AbstractAnnotation.js'

export default class Journey extends AbstractAnnotation {
  constructor ({ from, to, mode, color = null, distances, sections, duration, path }) {
    super()
    this.objectType = 'journey'
    this.name = from.name + ' - ' + to.name
    this.from = from // {name, coordinates}
    this.to = to // {name, coordinates}
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
    map.getMap().addSource(this.id, { type: 'geojson', data: this.path })
  }

  setColor (color) {
    this.color = color
    map.getMap().setPaintProperty(
      this.id,
      'line-color',
      color
    )
  }

  moveOnTop () {
    map.getMap().moveLayer(this.id)
  }

  show () {
    // TODO: mettre le layer des noms de villes au dessus
    map.getMap().addLayer({
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
    if (this.visible) { map.getMap().removeLayer(this.id) }
    this.visible = false
    return this.visible
  }

  destroy () {
    this.hide()
    map.getMap().removeSource(this.id)
  }

  zoomOn () {
    const bounds = new maplibregl.LngLatBounds(
      this.path.features[0].geometry.coordinates[0],
      this.path.features[0].geometry.coordinates[0]
    )

    for (const f of this.path.features) {
      if (f.geometry) {
        const coordinates = f.geometry.coordinates
        for (const coord of coordinates) {
          bounds.extend(coord)
        }
      }
    }

    map.getMap().fitBounds(bounds, {
      padding: 200
    })
  }

  toJson () {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      mode: this.mode,
      color: this.color,
      distances: this.distances,
      duration: this.duration,
      sections: this.sections,
      path: this.path,
      object_type: this.objectType
    }
  }
}
