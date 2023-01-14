import map from '../singletons/map.js'

export default class AbstractAnnotation {
  constructor () {
    this.id = crypto.randomUUID()
    this.visible = true
  }

  setColor (color) {}

  moveOnTop () {}

  show () {}

  hide () {}

  destroy () {}

  saveToAnnotations () {
    map.pushAnnotation(this)
  }

  removeFromAnnotations() {
    this.destroy()
    map.removeAnnotation(this)
  }

  zoomOn() {}
}
