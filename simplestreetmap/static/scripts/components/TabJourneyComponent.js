import {html, useState, useEffect} from '../../../static/vendor/preact/standalone.module.js'
import SearchComponent from './SearchComponent.js'
// import map from '../singletons/map.js'
import {fetchItinerary} from '../tools/api.js'
import LoadingComponent from './LoadingComponent.js'
import simplifyDuration from '../tools/simplifyDuration.js'
// import toulousePau from '../constants/toulouse-pau.js'
import Journey from '../models/Journey.js'

export default function TabJourneyComponent() {
  const [{Children, childrenProps}, setChildren] = useState({
    Children: JourneyFormComponent,
    childrenProps: {onSubmit: findJourney}
  })

  function findJourney(from, to, mode) {
    setChildren({Children: JourneyListComponent, childrenProps: {from, to, mode, backToForm}})
  }

  function backToForm(e) {
    setChildren({Children: JourneyFormComponent, childrenProps: {onSubmit: findJourney}})
    e.preventDefault()
    return false
  }

  return html`
    <h2>Plan your journey</h2>
    ${Children(childrenProps)}
  `
}

function JourneyFormComponent({onSubmit}) {
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)

  function AddStartPoint(coordinates, placeName) {
    setFrom({coordinates, placeName})
  }

  function addEndPoint(coordinates, placeName) {
    setTo({coordinates, placeName})
  }

  function _onSubmit(e) {
    const mode = document.getElementById('journey-mode-input').value
    onSubmit(from, to, mode)
    e.preventDefault()
    return false
  }

  return html`
    <form onSubmit=${_onSubmit}>
      <div class="form-field">
        <label for="journey-mode-input">Mode</label>
        <select name="mode" id="journey-mode-input">
          <option value="bike">Bike</option>
          <option value="public_transport">Public transport</option>
        </select>
      </div>
      <div class="form-field">
        <label for="journey-from-input">Start</label>
        <${SearchComponent} id="journey-from-input" onResultSelected="${AddStartPoint}"/>
      </div>

      <div class="form-field">
        <label for="journey-to-input">End</label>
        <${SearchComponent} id="journey-to-input" onResultSelected="${addEndPoint}"/>
      </div>
      <input class="standard-button" type="submit" value="Find itinerary"/>
    </form>
  `
}

function JourneyListComponent({from, to, mode, backToForm}) {
  // TODO: add not found status

  const [loading, setLoading] = useState(true)
  const [journeyList, setJourneyList] = useState(null)

  useEffect(() => {
    fetchItinerary(from.coordinates, to.coordinates, mode).then((value) => {
      const journeysPlain = value
      const journeys = journeysPlain.map((j) => {
        const journeyObj = new Journey({from, to, mode, color: '#ab9aba', ...j})
        journeyObj.show()
        return journeyObj
      })
      setJourneyList(journeys)
      setLoading(false)
    })
  }, [from, to])

  function _backToForm(e, journeyToKeep = null) {
    journeyList.forEach(j => {
      if (j.id === journeyToKeep) return
      j.hide()
      j.destroy()
    })
    backToForm(e)
  }

  return (loading || !journeyList)
    ? LoadingComponent({})
    : html`
      <div>
        <h3>From ${from.placeName} to ${to.placeName}</h3>
        <button onClick=${_backToForm}>Look for an other itinerary</button>
        <ul class="journey-summmary-list">
          ${journeyList.map((j) => JourneySummaryComponent({
            id: j.id,
            distances: j.distances,
            duration: j.duration,
            sections: j.sections,
            saveToAnnotations: j.saveToAnnotations.bind(j),
            setColor: j.setColor.bind(j),
            moveOnTop: j.moveOnTop.bind(j),
            backToForm: _backToForm
          }))}
        </ul>
      </div>
    `
}

function JourneySummaryComponent({
                                   id,
                                   distances,
                                   duration,
                                   sections,
                                   saveToAnnotations,
                                   setColor,
                                   moveOnTop,
                                   backToForm
                                 }) {
  const [simplifiedDistance, setSimplifiedDistance] = useState(null)

  function hover() {
    setColor('#69369B')
    moveOnTop()
  }

  useEffect(() => {
    if (typeof (distances) === 'string') {
      // if distances > 1000, display in km
      if (distances > 1000) {
        setSimplifiedDistance(`${Math.round(distances / 1000)} km`)
      } else {
        setSimplifiedDistance(`${Math.round(distances)} m`)
      }
    }
  }, [distances])

  function out() {
    setColor('#ab9aba')
  }

  function save(e) {
    saveToAnnotations()
    setColor('#69369B')
    backToForm(e, id)
  }

  return html`
    <li class="journey-summmary" onmouseover=${hover} onmouseout=${out}>
      <div>Distance: ${simplifiedDistance}</div>
      <div>Duration: ${simplifyDuration(duration)}</div>
      <div>Steps: ${sections.length}</div>
      <button class="standard-button" onClick=${save}>Save</button>
    </li>
  `
}
