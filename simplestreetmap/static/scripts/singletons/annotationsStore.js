import webSocketClient from './webSocketClient.js'

class AnnotationStore {
  constructor () {
    this.localAnnotations = {} // itineraries, places, drawings, etc. {annotation_id: annotation}
    this.syncAnnotations = {}
    this.callbacksOnAnnotationsChange = []
  }

  notifyAnnotationsChange (action, annotation) {
    this.callbacksOnAnnotationsChange.forEach(callback => callback(action, annotation, { ...this.localAnnotations, ...this.syncAnnotations }))
  }

  onAnnotationsChange (callback) {
    this.callbacksOnAnnotationsChange.push(callback)
  }

  addLocalAnnotation (annotation, { sendToServer = true } = {}) {
    annotation.setSynced(false)
    this.localAnnotations[annotation.id] = annotation
    this.notifyAnnotationsChange('addLocalAnnotation', annotation)
    if (sendToServer && webSocketClient.canEdit) {
      annotation.setShouldBeSynced(true)
      webSocketClient.send({ action: 'add_annotation', annotation: annotation.toJson() })
    } else {
      annotation.setShouldBeSynced(false)
    }
  }

  removeLocalAnnotation (id, { destroy = true } = {}) {
    const annotation = this.localAnnotations[id]
    delete this.localAnnotations[id]
    this.notifyAnnotationsChange('removeLocalAnnotation', annotation)
    if (destroy) {
      annotation.destroy()
    }
  }

  updateLocalAnnotation (annotation, updatedFields) {
    annotation.update(updatedFields)
    this.notifyAnnotationsChange('updateLocalAnnotation', annotation)
  }

  addSyncAnnotation (annotation) {
    annotation.setSynced(true)
    this.syncAnnotations[annotation.serverId] = annotation
    this.notifyAnnotationsChange('addSyncAnnotation', annotation)
  }

  removeSyncAnnotation (serverId, { sendToServer = true, destroy = true } = {}) {
    const annotation = this.syncAnnotations[serverId]
    if (annotation) {
      delete this.syncAnnotations[serverId]
      this.notifyAnnotationsChange('removeSyncAnnotation', annotation)

      if (sendToServer && webSocketClient.canEdit) {
        webSocketClient.send({ action: 'remove_annotation', id: serverId, object_type: annotation.objectType })
      }

      if (destroy) {
        annotation.destroy()
      }
    }
  }

  updateSyncAnnotation (annotation, updatedFields, { sendToServer = true } = {}) {
    this.notifyAnnotationsChange('updateSyncAnnotation', annotation)
    annotation.update(updatedFields)
    if (sendToServer && webSocketClient.canEdit) {
      annotation.setSynced(false)
      webSocketClient.send({ action: 'update_annotation', annotation: annotation.toJson() })
    }
  }

  moveLocalAnnotationToSync (localId, serverId) {
    const annotation = this.localAnnotations[localId]
    annotation.serverId = serverId
    annotation.setSynced(true)
    this.addSyncAnnotation(annotation)
    this.removeLocalAnnotation(localId, { destroy: false })
  }

  getLocalAnnotation (id) {
    return this.localAnnotations[id]
  }

  getSyncAnnotation (id) {
    return this.syncAnnotations[id]
  }

  removeAnnotation (annotation) {
    if (annotation.serverId) {
      this.removeSyncAnnotation(annotation.serverId)
    } else if (annotation.id) {
      this.removeLocalAnnotation(annotation.id)
    } else {
      console.warn('removeAnnotation: annotation has no id')
    }
  }

  updateAnnotation (annotation, updatedFields) {
    if(annotation.shouldBeSynced === true && annotation.synced === false) {
      console.warn('updateAnnotation: annotation should be synced before update, aborting')
      return
    }
    if (annotation.serverId) {
      this.updateSyncAnnotation(annotation, updatedFields)
    } else if (annotation.id) {
      this.updateLocalAnnotation(annotation, updatedFields)
    } else {
      console.warn('editAnnotation: annotation has no id')
    }
  }
}

const annotationStore = new AnnotationStore()

export default annotationStore
