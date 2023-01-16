import { html, useState } from '../../../static/vendor/preact/standalone.module.js'
import SearchComponent from './SearchComponent.js'
import Place from '../models/Place.js'
import map from '../singletons/map.js'

export default function TabExploreComponent () {

  function addPlace (coordinates, placeName) {
    new Place({ lat: coordinates[1], lng: coordinates[0], name: placeName })
    map.flyTo({ center: coordinates, zoom: 13 })
  }

  return html`
    <h2>Explore the world!</h2>
    ${ExploreFormComponent({onResultSelected:addPlace})}
  `
}

function ExploreFormComponent ({onResultSelected}) {
  return html`
  <div class="form-field">
    <label for="search-input">What are you looking for?</label>
    <${SearchComponent} id="search-input" onResultSelected="${onResultSelected}"/>
  </div>
  `
}

function ExploreDetailComponent({lat, lng, name, context}) {
  return html`
    <h3>${name}</h3>
    <div class="context">${context.join(', ')}</div>
    <div>GPS coordinate: ${lat},${lng}</div>
    <button>Start an itinerary from ${name}</button>
    <button>Start an itinerary to ${name}</button>
  `
}
