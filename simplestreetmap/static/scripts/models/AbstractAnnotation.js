export default class AbstractAnnotation {
  constructor () {
    this.id = crypto.randomUUID()
    this.visible = false
    this.canBeDestroy = true
    this.serverId = null
    this.synced = false
  }

  setColor (color) {}

  moveOnTop () {}

  show () {}

  hide () {}

  destroy () {}

  zoomOn () {}

  setSynced (synced) {
    this.synced = synced
  }

  toJson () {
    return {
      id: this.id,
      object_type: this.objectType
    }
  }
}
