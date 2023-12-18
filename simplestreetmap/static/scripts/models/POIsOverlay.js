import map from '../singletons/map.js'
import AbstractAnnotation from './AbstractAnnotation.js'

export default class POIsOverlay extends AbstractAnnotation {
  constructor ({ tilesUrl, sourceLayer, name, color }) {
    super()
    this.tilesUrl = tilesUrl
    this.objectType = 'Poi'
    this.sourceLayer = sourceLayer
    this.name = name ?? sourceLayer
    this.color = color ?? 'blue'
    this.canBeDestroy = false
    this.addSource()
  }

  addSource () {
    map.getMap().addSource(this.id, {
      type: 'vector',
      tiles: [`${this.tilesUrl}/${this.sourceLayer}/{z}/{x}/{y}.pbf`],
      minzoom: 10
    })
  }

  setColor (color) {
    this.color = color
    map.getMap().setPaintProperty(
      this.id,
      'circle-color',
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
    map.getMap().removeLayer(this.id)
    this.visible = false
    return this.visible
  }

  destroy () {
    map.getMap().removeSource(this.id)
  }

  toJson () {
    return {
      tiles_url: this.tilesUrl,
      source_layer: this.sourceLayer,
      name: this.name,
      color: this.color,
      object_type: this.objectType
    }
  }
}
