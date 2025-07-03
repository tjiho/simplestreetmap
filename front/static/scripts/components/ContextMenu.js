import { html, useEffect, useState } from '../../../static/vendor/preact/standalone.module.js'
import { fetchReverseGeocoding } from '../tools/api.js'
import eventBus from '../singletons/eventBus.js'
import Place from '../models/Place.js'
import annotationStore from '../singletons/annotationsStore.js'
import LoadingComponent from './LoadingComponent.js'

export default function ContextMenu ({ coordinates, currentPopup, local, canEdit }) {
  const [place, setPlace] = useState({ name: '' })
  const options = [
    {
      label: 'Add an annotation',
      callback: () => {
        annotationStore.addLocalAnnotation(new Place({ lat: place.coord[1], lng: place.coord[0], name: place.name, context: place.context }))
        currentPopup.remove()
      }
    },
    {
      label: 'Set as start',
      callback: () => {
        eventBus.emit('selectTab', { tab: 1 })
        eventBus.emit('startJourneyFrom', { place: { coordinates: place.coord, name: place.name } })
        currentPopup.remove()
      }
    },
    {
      label: 'Set as destination',
      callback: () => {
        eventBus.emit('selectTab', { tab: 1 })
        eventBus.emit('startJourneyTo', { place: { coordinates: place.coord, name: place.name } })
        currentPopup.remove()
      }
    }
  ]

  useEffect(async () => {
    fetchReverseGeocoding(coordinates).then((res) => {
      setPlace({ ...res })
    })
  }, [])

  return html`
    <div class="context-menu">
      ${place?.name ? baseContextMenu({ title: place.name, options }) : LoadingComponent({})}
    </div>
  `
}

function baseContextMenu ({ title, options }) {
  return html`
    <h3>${title}</h3>
    <ul class="menu-section">
        ${options.map(option => html`
            <li onClick=${option.callback}>
                ${option.label}
            </li>
        `)}
    </ul>
  `
}
