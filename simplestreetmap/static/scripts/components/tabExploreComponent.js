import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import searchComponent from './searchComponent.js';
import places from '../singletons/places.js'
import map from '../singletons/map.js'

export default function tabExploreComponent() {

  function addPlace(coordinates, placeName) {
    places.add(coordinates[1], coordinates[0], placeName)
    map.flyTo({ center: coordinates, zoom: 13 })
  }

  return html`
    <label for="search-input">Explore the world! What are you looking for?</label>
    <${searchComponent} id="search-input" onResultSelected="${addPlace}"/>
  `
}
