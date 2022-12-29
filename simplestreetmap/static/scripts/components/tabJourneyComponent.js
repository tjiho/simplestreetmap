import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import searchComponent from './searchComponent.js';
import places from '../singletons/places.js'
import map from '../singletons/map.js'
import { fetchItinerary } from '../tools/api.js'

export default function tabJourneyComponent() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  function AddStartPoint(coordinates, placeName) {
    setFrom(coordinates)
  }

  function addEndPoint(coordinates, placeName) {
    setTo(coordinates)
  }

  function findItinerary(e) {
    console.log('from', from)
    console.log('to', to)
    fetchItinerary(from, to).then(itinerary => {
      console.log(itinerary)
      itinerary[0]['sections'].map((section,index) => {
        map.printItinerary(section['path'],`itinerary-${index}`)
      })
      //map.printItinerary(itinerary[0]['sections'][0]['path'])
    })
    e.preventDefault()
  }

  return html`
    <h2>Find a journey</h2>
    <form onSubmit=${findItinerary}>
      <label for="journey-from-input">Start</label>
      <${searchComponent} id="journey-from-input" onResultSelected="${AddStartPoint}"/>
      <label for="journey-to-input">End</label>
      <${searchComponent} id="journey-to-input" onResultSelected="${addEndPoint}"/>
      <input class="standard-button" type="submit" value="Find itinerary"/>
    </form>
  `
}
