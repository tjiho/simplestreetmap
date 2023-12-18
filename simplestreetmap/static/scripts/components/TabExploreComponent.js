import { html, useState } from '../../../static/vendor/preact/standalone.module.js'

import SearchComponent from './SearchComponent.js'
import Place from '../models/Place.js'
import map from '../singletons/map.js'
import eventBus from '../singletons/eventBus.js'

export default function TabExploreComponent () {
  const [place, setPlace] = useState(null)

  function addPlace (coordinates, name, context) {
    setPlace(new Place({ lat: coordinates[1], lng: coordinates[0], name, context }))
    map.getMap().flyTo({ center: coordinates, zoom: 13 })
  }

  eventBus.on('selectPlace', (e) => {
    setPlace(e.detail.place)
  })

  return html`
    <h2>Explore the world!</h2>
    ${ExploreFormComponent({ onResultSelected: addPlace })}
    ${place && ExploreDetailComponent(place)}
  `
}

function ExploreFormComponent ({ onResultSelected }) {
  const [search, setSearch] = useState('')

  function onInputSearch (e) {
    setSearch(e.target.value)
  }

  return html`
  <div class="form-field">
    <label for="search-input">What are you looking for?</label>
    <${SearchComponent} id="search-input" onResultSelected="${onResultSelected}" value="${search}" onInput=${onInputSearch}/>
  </div>
  `
}

function ExploreDetailComponent ({ lat, lng, name, context }) {
  function addStartPoint () {
    eventBus.emit('selectTab', { tab: 1 })
    eventBus.emit('startJourneyFrom', { place: { coordinates: [lng, lat], name } })
  }

  function addEndPoint () {
    eventBus.emit('selectTab', { tab: 1 })
    eventBus.emit('startJourneyTo', { place: { coordinates: [lng, lat], name } })
  }

  return html`
    <div class="place-detail">
      <h3>${name}</h3>
      <div class="context secondary-text">${context.join(', ')}</div>
      <div class="secondary-text">${lat}, ${lng}</div>
      <button class="standard-button" onClick=${addStartPoint}>Itinerary from</button>
      <button class="standard-button" onClick=${addEndPoint}>Itinerary to</button>
    </div>
  `
}
