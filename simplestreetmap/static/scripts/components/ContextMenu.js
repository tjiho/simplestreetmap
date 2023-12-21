import { html, useEffect, useState } from '../../../static/vendor/preact/standalone.module.js'
import { fetchReverseGeocoding } from '../tools/api.js'
import eventBus from '../singletons/eventBus.js'
import Place from '../models/Place.js'
import annotationStore from '../singletons/annotationsStore.js'
import LoadingComponent from './LoadingComponent.js'

export default function ContextMenu ({ coordinates, currentPopup }) {
  const [place, setPlace] = useState({ name: '' })
  // const [value, setValue] = useState(0);
  const options = [
    {
      label: 'Add an annotation',
      callback: () => {
        annotationStore.addLocalAnnotation(new Place({ lat: place.coord[1], lng: place.coord[0], name: place.name, context: place.context }))
        currentPopup.remove()
      }
    },
    {
      label: 'Start an itinerary from',
      callback: () => {
        eventBus.emit('selectTab', { tab: 1 })
        eventBus.emit('startJourneyFrom', { place: { coordinates: place.coord, name: place.name } })
        currentPopup.remove()
      }
    },
    {
      label: 'Start an itinerary to',
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
    // setPlace(res)
  }, [])

  return html`
        <div class="context-menu">
            ${place?.name ? baseContextMenu({ title: place.name, options }) : LoadingComponent({})}
        </div>
    `
}
//

// options: [{label, callback}]
function baseContextMenu ({ title, options }) {
  // const isCity = CITY_TYPES.includes(type)

  // return html`
  //   <li onClick=${(e) => onResultSelected(coord, name, context)} selected=${selected}>
  //     <span class="name">${name}</span>
  //     <span class="context secondary-text">${context.join(', ')}</span>
  //     ${isCity ? html`<img src="/static/images/maki/${type}.svg" />` : ''}
  //   </li>
  // `

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
