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

  addLocalAnnotation (annotation) {
    this.localAnnotations[annotation.id] = annotation
    this.notifyAnnotationsChange('addLocalAnnotation', annotation)
  }

  removeLocalAnnotation (id) {
    const annotation = this.localAnnotations[id]
    delete this.localAnnotations[id]
    this.notifyAnnotationsChange('removeLocalAnnotation', annotation)
  }

  addSyncAnnotation (annotation) {
    this.syncAnnotations[annotation.id] = annotation
    this.notifyAnnotationsChange('addSyncAnnotation', annotation)
  }

  removeSyncAnnotation (id) {
    const annotation = this.localAnnotations[id]
    delete this.syncAnnotations[id]
    this.notifyAnnotationsChange('removeSyncAnnotation', annotation)
  }

  moveLocalAnnotationToSync (id) {
    // todo
  }

  getLocalAnnotation (id) {
    return this.localAnnotations[id]
  }

  getSyncAnnotation (id) {
    return this.syncAnnotations[id]
  }

  removeAnnotation(annotation) {
    if(annotation.backendId) {
        this.removeSyncAnnotation(annotation.backendId)
    } else if (annotation.id) {
        this.removeLocalAnnotation(annotation.id)
    } else {
        console.warn('removeAnnotation: annotation has no id')
    }
  }
}

const annotationStore = new AnnotationStore()

export default annotationStore