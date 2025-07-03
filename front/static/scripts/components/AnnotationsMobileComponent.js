import { html, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js'

import eventBus from '../singletons/eventBus.js'
import annotationStore from '../singletons/annotationsStore.js'

export default function ListAnnotationsComponent ({ setDisplayAnnotations, local }) {
  const [annotations, setAnnotations] = useState({})

  useEffect(() => {
    annotationStore.onAnnotationsChange((action, newElement, newAnnotations) => {
      setAnnotations({ ...newAnnotations })
    })
  }, [])

  function openAnnotationMobile () {
    setDisplayAnnotations(true)
  }

  return html`
  <button id="annotation-mobile-button" onclick=${openAnnotationMobile}>
    <span>${Object.values(annotations)?.length ?? 0} annotations</span>
    ${local && html`<img class="icon--medium" src="/static/images/breeze/folder-cloud-no.svg"/>`}
    ${!local && html`<img class="icon--medium" src="/static/images/breeze/folder-cloud.svg"/>`}
  </button>
  `
}
