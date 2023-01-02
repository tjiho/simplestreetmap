import {html, useState, useEffect} from '../../../static/vendor/preact/standalone.module.js'
import SearchComponent from './SearchComponent.js'
// import places from '../singletons/places.js'
// import map from '../singletons/map.js'
import {fetchItinerary} from '../tools/api.js'
import LoadingComponent from './LoadingComponent.js'
import simplifyDuration from '../tools/simplifyDuration.js'
import toulousePau from '../constants/toulouse-pau.js'
import Journey from "../models/Journey.js";


export default function TabJourneyComponent() {
  const [{Children, childrenProps}, setChildren] = useState({
    Children: ItineraryFormComponent,
    childrenProps: {onSubmit: findItinerary}
  })

  function findItinerary(from, to) {
    setChildren({Children: JourneyListComponent, childrenProps: {from, to, backToForm}})
  }

  function backToForm(e) {
    setChildren({Children: ItineraryFormComponent, childrenProps: {onSubmit: findItinerary}})
    e.preventDefault()
    return false
  }

  return html`
    <h2>Plan your journey</h2>
    ${Children(childrenProps)}
  `
}

function ItineraryFormComponent({onSubmit}) {
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)

  function AddStartPoint(coordinates, placeName) {
    setFrom({coordinates, placeName})
  }

  function addEndPoint(coordinates, placeName) {
    setTo({coordinates, placeName})
  }

  function _onSubmit(e) {
    onSubmit(from, to)
    e.preventDefault()
    return false
  }

  return html`
    <form onSubmit=${_onSubmit}>
      <label for="journey-from-input">Start</label>
      <${SearchComponent} id="journey-from-input" onResultSelected="${AddStartPoint}"/>
      <label for="journey-to-input">End</label>
      <${SearchComponent} id="journey-to-input" onResultSelected="${addEndPoint}"/>
      <input class="standard-button" type="submit" value="Find itinerary"/>
    </form>
  `
}

function JourneyListComponent({from, to, backToForm}) {
  // TODO: add not found status

  const [loading, setLoading] = useState(true)
  const [journeyList, setJourneyList] = useState(null)

  useEffect(() => {
    /*
    fetchItinerary(from.coordinates, to.coordinates).then((value) => {
      setItinerary(value)
      setLoading(false)
    })*/
    const journeysPlain = toulousePau
    const journeys = journeysPlain.map((j) => {
        const journeyObj = new Journey({from, to, ...j})
        return journeyObj
    })
    setJourneyList(journeys)
    setLoading(false)
  }, [from, to])

  return (loading || !journeyList)
    ? LoadingComponent({})
    : html`
    <div>
      <h3>From ${from.placeName} to ${to.placeName}</h3>
      <button onClick=${backToForm}>Look for an other itinerary</button>
      <ul class="itinerary-summmary-list">
        ${journeyList.map(JourneySummaryComponent)}
      </ul>
    </div>
  `
}

function JourneySummaryComponent({distances, duration, sections, display}) {
  function hover() {

  }

  return html`
    <li class="itinerary-summmary" onmouseover=${hover} >
      <div>Distance: </div>
      <div>Duration: ${simplifyDuration(duration)}</div>
      <div>Steps: ${sections.length}</div>
      <button class="standard-button">See detail</button>
    </li>
  `
}
