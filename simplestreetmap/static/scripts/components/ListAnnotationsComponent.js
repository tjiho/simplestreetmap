import { html, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js'

import map from '../singletons/map.js'
import eventBus from '../singletons/eventBus.js'

export default function ListAnnotationsComponent () {
  const [annotations, setAnnotations] = useState({})

  useEffect(() => {
    map.onAnnotationsChange((action, newElement, newAnnotations) => {
      setAnnotations({ ...newAnnotations })
    })
  }, [])

  function clickOnAnnotation (annotation) {
    if (annotation.objectType === 'place') {
      eventBus.emit('selectTab', { tab: 0 })
      eventBus.emit('selectPlace', { place: annotation })
    }
  }

  return html`
    <h2>Annotations</h2>
    <ul>
      ${Object.values(annotations).map((annotation) => AnnotationLineComponent({
        name: annotation.name,
        objectType: annotation.objectType,
        removeFromAnnotations: annotation.removeFromAnnotations.bind(annotation),
        baseVisible: annotation.visible,
        show: annotation.show.bind(annotation),
        hide: annotation.hide.bind(annotation),
        zoomOn: annotation.zoomOn.bind(annotation),
        onClick: () => clickOnAnnotation(annotation),
        canBeDestroy: annotation.canBeDestroy,
        key: annotation.id
      }))}
    </ul>
  `
}

function AnnotationLineComponent ({ name, objectType, removeFromAnnotations, baseVisible, show, hide, zoomOn, onClick, canBeDestroy }) {
  const [visible, setVisibility] = useState(baseVisible)

  function _removeAnnotation (e) {
    removeFromAnnotations()
    e.preventDefault()
  }

  function _show (e) {
    setVisibility(show())
    e.preventDefault()
  }

  function _hide (e) {
    setVisibility(hide())
    e.preventDefault()
  }

  function clickOnAnnotation (e) {
    zoomOn()
    onClick()
    e.preventDefault()
  }

  return html`
    <li class="annotations-line" title="${name}">
      ${AnnotationIconTypeComponent({ objectType })}
      <span class="annotations-line__name" onClick=${clickOnAnnotation}>${name}</span>
      <div class="annotations-line__actions">
        <button title="Edit annotation">
          <img src="/static/images/breeze/document-edit.svg" alt="pen icon"/>
        </button>

        <button onclick="${visible ? _hide : _show}" title="${visible ? 'Hide annotation' : 'Show annotation'}">
          ${
            visible
              ? html`<img src="/static/images/breeze/view-visible.svg" alt="eye icon"/>`
              : html`<img src="/static/images/breeze/view-hidden.svg" alt="eye crossed icon"/>`
          }
        </button>
        
        <button onclick="${_removeAnnotation}" title="Remove annotation">
          <img src="/static/images/breeze/edit-delete-black.svg" alt="trash icon"/>
        </button>
      </div>
    </li>
  `
}

function AnnotationIconTypeComponent ({ objectType }) {
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
