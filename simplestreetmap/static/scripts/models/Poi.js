import map from '../singletons/map.js'
import AbstractAnnotation from './AbstractAnnotation.js'

export default class Journey extends AbstractAnnotation {
  constructor ({ sourceLayer, name, color }) {
    super()
    this.objectType = 'Poi'
    this.sourceLayer = sourceLayer
    this.name = name ?? sourceLayer
    this.color = color ?? 'blue'
    this.canBeDestroy = false
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
    map.addSource(this.id, {
      type: 'vector',
      tiles: [`${BASE_FEATURES_URL}/${this.sourceLayer}/{z}/{x}/{y}.pbf`],
      minzoom: 10
    })
  }

  setColor (color) {
    this.color = color
    map.setPaintProperty(
      this.id,
      'circle-color',
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
      type: 'circle',
      source: this.id,
      'source-layer': this.sourceLayer,
      paint: {
        'circle-color': this.color
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
