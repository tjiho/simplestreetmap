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

  saveToAnnotations () {
    map.pushAnnotation(this)
  }

  removeFromAnnotations () {
    if (this.canBeDestroy) {
      this.destroy()
      map.removeAnnotation(this)
    }
  }

  zoomOn () {}
}
