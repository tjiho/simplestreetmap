import map from '../singletons/map.js'
import annotationStore from '../singletons/annotationsStore.js' 

export default class Poi {
  constructor () {
    this.id = crypto.randomUUID()
    this.visible = false
    this.canBeDestroy = true
    this.backendId = null
  }

  setColor (color) {}

  moveOnTop () {}

  show () {}

  hide () {}

  destroy () {}

  // don't use -> do directly annotationStore.addLocalAnnotation(annotation)
  saveToAnnotations (source = 'self') {
    annotationStore.addLocalAnnotation(this)
  }

  removeFromAnnotations (source = 'self') {
    if (this.canBeDestroy) {
      this.destroy()
      annotationStore.removeAnnotation(this, source)
    }
  }

  zoomOn () {}

  toJson () {
    return {
      id: this.id,
      object_type: this.objectType
    }
  }
}
