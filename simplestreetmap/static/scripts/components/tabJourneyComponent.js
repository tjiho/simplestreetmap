import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import searchComponent from './searchComponent.js';
import places from '../singletons/places.js'
import map from '../singletons/map.js'

export default function tabJourneyComponent() {

  function toto(coordinates, placeName) {
    
  }

  return html`
    <h2>Find a journey</h2>
    <label for="journey-start-input">Start</label>
    <${searchComponent} id="journey-start-input" onResultSelected="${toto}"/>
    <label for="journey-end-input">End</label>
    <${searchComponent} id="journey-end-input" onResultSelected="${toto}"/>
    <button>Find itinerary</button>
  `
}
