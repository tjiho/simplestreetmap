export default class AbstractAnnotation {
  constructor () {
    this.id = crypto.randomUUID()
    this.visible = false
    this.canBeDestroy = true
    this.serverId = null
    this.synced = false
    this.shouldBeSynced = true
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

  setShouldBeSynced (shouldBeSynced) {
    this.shouldBeSynced = shouldBeSynced
  }

  update(newAnnotationFields) {}

  toJson () {
    return {
      id: this.id,
      object_type: this.objectType
    }
  }
}
