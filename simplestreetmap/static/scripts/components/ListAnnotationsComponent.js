import {html, useEffect, useState} from '../../../static/vendor/preact/standalone.module.js'
import map from '../singletons/map.js'

export default function ListAnnotationsComponent() {
  const [annotations, setAnnotations] = useState({})

  useEffect(() => {
    map.onAnnotationsChange((action, newElement, newAnnotations) => {
      setAnnotations({...newAnnotations})
    })
  }, [])

  return html`
    <h2>Annotations</h2>
    <ul>
      ${Object.values(annotations).map((annotations) => AnnotationLineComponent({
        name: annotations.name,
        objectType: annotations.objectType,
        removeFromAnnotations: annotations.removeFromAnnotations.bind(annotations)
      }))}
    </ul>
  `
}

function AnnotationLineComponent({name, objectType, removeFromAnnotations}) {

  function _removeAnnotation(e) {
    removeFromAnnotations()
    e.preventDefault()
  }

  return html`
    <li class="annotations-line">
      ${AnnotationIconTypeComponent({objectType})}
      <span class="annotations-line__name">${name}</span>
      <div class="annotations-line__actions">
        <button>
          <img src="/static/images/breeze/document-edit.svg"/>
        </button>

        <button>
          <img src="/static/images/breeze/view-visible.svg"/>
        </button>

        <button onclick="${_removeAnnotation}">
          <img src="/static/images/breeze/edit-delete-black.svg"/>
        </button>
      </div>
    </li>
  `
}

function AnnotationIconTypeComponent({objectType}) {
  switch (objectType) {
    case 'journey':
      return html`<img src="/static/images/breeze-white-icon/draw-arrow.svg" class="annotations-line__icon"/>`
    case 'place':
      return html`<img src="/static/images/breeze-white-icon/edit-paste-in-place.svg" class="annotations-line__icon"/>`
    default:
      return html`<img src="/static/images/breeze-white-icon/edit-paste-in-place.svg" class="annotations-line__icon"/>`
  }
}

// colors[Math.floor(Math.random()*colors.length)];
