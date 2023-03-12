import map from '../singletons/map.js'

export default class Poi {
  constructor () {
    this.id = crypto.randomUUID()
    this.visible = false
    this.canBeDestroy = true
  }

  setColor (color) {}

  moveOnTop () {}

  show () {}

  hide () {}

  destroy () {}

  saveToAnnotations (source = 'self') {
    map.pushAnnotation(this, source)
  }

  removeFromAnnotations (source = 'self') {
    if (this.canBeDestroy) {
      this.destroy()
      map.removeAnnotation(this, source)
    }
  }

  zoomOn () {}

  toJson () {
    return {
      id: this.id,
      objectType: this.objectType
    }
  }
}
