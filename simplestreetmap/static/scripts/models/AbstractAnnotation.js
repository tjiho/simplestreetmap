export default class AbstractAnnotation {
  constructor () {
    this.id = crypto.randomUUID()
    this.visible = false
    this.canBeDestroy = true
    this.serverId = null
  }

  setColor (color) {}

  moveOnTop () {}

  show () {}

  hide () {}

  destroy () {}

  zoomOn () {}

  toJson () {
    return {
      id: this.id,
      object_type: this.objectType
    }
  }
}
