import map from "../singletons/map.js";

export default class Journey {
  constructor({from, to, mode, color = null, distances, sections, duration, path}) {
    this.id = crypto.randomUUID();
    this.from = from;
    this.to = to;
    this.mode = mode;
    this.color = color;
    this.distances = distances
    this.duration = duration
    this.sections = sections
    this.path = this.mergePath()
    this.alternatives = [] // other journeys return by the api for the same itinerary
    this.display = this._display.bind(this)
    this.setColor = this._setColor.bind(this)
    this.moveOnTop = this._moveOnTop.bind(this)
    this.hide = this._hide.bind(this)
    this.destroy = this._destroy.bind(this)
    this.addSource()
  }

  mergePath() {
    return {
      'type': 'FeatureCollection',
      'features': this.sections.map((section) => ({
        'type': 'Feature',
        'geometry': section.path
      }))
    }
  }

  addSource() {
    map.addSource(this.id,{type:'geojson',data: this.path})
  }

  _display() {
    //TODO: layer des nom de villes au dessus
    map.printItinerary(this.id,this.color)
  }

  _setColor(color) {
    this.color = color
    map.setPaintProperty(
      this.id,
      'line-color',
      color
    );
  }

  _moveOnTop() {
    map.moveLayer(this.id)
  }

  _hide() {
    map.removeLayer(this.id)
  }

  _destroy() {
    map.removeSource(this.id)
  }




}