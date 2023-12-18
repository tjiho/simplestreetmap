import { html, useEffect, useState } from '../../../static/vendor/preact/standalone.module.js'
import { fetchReverseGeocoding } from '../tools/api.js'
import LoadingComponent from './LoadingComponent.js'

export default function ContextMenu ({ coordinates }) {
  const [place, setPlace] = useState(null)

  const options = [
    {
      label: 'Add an annotation',
      callback: () => {
        new Place({ lat: coordinates[1], lng: coordinates[0], name: 'prout', context: '' })
        popup.remove()
      }
    },
    { label: 'Start an itinerary from', callback: () => {} },
    { label: 'Start an itinerary to', callback: () => {} }
  ]

  useEffect(async () => {
    const res = await fetchReverseGeocoding(coordinates)
    console.log(res)
    // setPlace(res)
  }, [])

  return html`
        <div class="context-menu">
            ${place ? baseContextMenu({ options }) : LoadingComponent({})}
        </div>
    `
}

// options: [{label, callback}]
function baseContextMenu ({ options }) {
  // const isCity = CITY_TYPES.includes(type)

  // return html`
  //   <li onClick=${(e) => onResultSelected(coord, name, context)} selected=${selected}>
  //     <span class="name">${name}</span>
  //     <span class="context secondary-text">${context.join(', ')}</span>
  //     ${isCity ? html`<img src="/static/images/maki/${type}.svg" />` : ''}
  //   </li>
  // `

  return html`
        <ul class="menu-section">
            ${options.map(option => html`
                <li onClick=${option.callback}>
                    ${option.label}
                </li>
            `)}
        </ul>
    `
}
