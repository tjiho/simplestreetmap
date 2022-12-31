import { html } from '../../../static/vendor/preact/standalone.module.js'
import SearchComponent from './SearchComponent.js'
import places from '../singletons/places.js'
import map from '../singletons/map.js'

export default function TabExploreComponent () {
  function addPlace (coordinates, placeName) {
    places.add(coordinates[1], coordinates[0], placeName)
    map.flyTo({ center: coordinates, zoom: 13 })
  }

  return html`
    <h2>Explore the world!</h2>
    <label for="search-input">What are you looking for?</label>
    <${SearchComponent} id="search-input" onResultSelected="${addPlace}"/>
  `
}
