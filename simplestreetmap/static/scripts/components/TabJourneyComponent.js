import { html, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js'
import SearchComponent from './SearchComponent.js'
// import map from '../singletons/map.js'
import { fetchItinerary } from '../tools/api.js'
import LoadingComponent from './LoadingComponent.js'
import simplifyDuration from '../tools/simplifyDuration.js'
// import toulousePau from '../constants/toulouse-pau.js'
import Journey from '../models/Journey.js'
import eventBus from '../singletons/eventBus.js'

export default function TabJourneyComponent () {
  const [state, setState] = useState('form')
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [mode, setMode] = useState(null)

  function findJourney (from, to, mode) {
    setFrom(from)
    setTo(to)
    setMode(mode)
    setState('list')
  }

  function backToForm (e) {
    setState('form')
    e.preventDefault()
    return false
  }

  switch (state) {
    case 'form':
      return html`
        <h2>Plan your journey</h2>
        <${JourneyFormComponent} onSubmit=${findJourney}/>
      `
    case 'list':
      return html`
        <h2>Plan your journey</h2>
        <${JourneyListComponent} from=${from} to=${to} mode=${mode} backToForm=${backToForm}/>
      `
    default:
      return html`
        <h2>Plan your journey</h2>
        <${JourneyFormComponent} onSubmit=${findJourney}/>
      `
  }
}

function JourneyFormComponent ({ onSubmit }) {
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)

  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')

  function onInputFrom (e) {
    setSearchFrom(e.target.value)
  }

  function onInputTo (e) {
    setSearchTo(e.target.value)
  }

  function AddStartPoint (coordinates, name) {
    setFrom({ coordinates, name })
  }

  function addEndPoint (coordinates, name) {
    setTo({ coordinates, name })
  }

  eventBus.on('startJourneyFrom', (e) => {
    setFrom(e.detail.place)
    setSearchFrom(e.detail.place.name)
  })

  eventBus.on('startJourneyTo', (e) => {
    setTo(e.detail.place)
    setSearchTo(e.detail.place.name)
  })

  function _onSubmit (e) {
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
          <option value="walk">Walk</option>
          <option value="camera">Walk without camera</option>
        </select>
      </div>
      <div class="form-field">
        <label for="journey-from-input">Start</label>
        <${SearchComponent} id="journey-from-input" onResultSelected="${AddStartPoint}" value=${searchFrom} onInput=${onInputFrom}/>
      </div>

      <div class="form-field">
        <label for="journey-to-input">End</label>
        <${SearchComponent} id="journey-to-input" onResultSelected="${addEndPoint}" value=${searchTo} onInput=${onInputTo}/>
      </div>
      <input class="standard-button" type="submit" value="Find itinerary"/>
    </form>
  `
}

function JourneyListComponent ({ from, to, mode, backToForm }) {
  // TODO: add not found status

  const [loading, setLoading] = useState(true)
  const [journeyList, setJourneyList] = useState(null)

  useEffect(() => {
    fetchItinerary(from.coordinates, to.coordinates, mode).then((value) => {
      const journeysPlain = value
      const journeys = journeysPlain.map((j) => {
        const journeyObj = new Journey({ from, to, mode, color: '#ab9aba', ...j })
        journeyObj.show()
        return journeyObj
      })
      setJourneyList(journeys)
      setLoading(false)
    }).catch((error) => {
      setJourneyList([])
      setLoading(false)
    })
  }, [from, to])

  function _backToForm (e, journeyToKeep = null) {
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
        <h3>From ${from.name} to ${to.name}</h3>
        <button onClick=${_backToForm} class="standard-button button--secondary">Look for an other itinerary</button>
        <ul class="journey-summmary-list">
          ${journeyList.map((j) => JourneySummaryComponent({
            id: j.id,
            distances: j.distances,
            duration: j.duration,
            sections: j.sections,
            saveToAnnotations: j.saveToAnnotations.bind(j),
            setColor: j.setColor.bind(j),
            moveOnTop: j.moveOnTop.bind(j),
            backToForm: _backToForm,
            key: j.id
          }))}
        </ul>
        ${journeyList.length == 0 && html`
          <p>No journeys founds</p>
        `}
      </div>
    `
}

function JourneySummaryComponent ({
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

  function hover () {
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

  function out () {
    setColor('#ab9aba')
  }

  function save (e) {
    saveToAnnotations()
    setColor('#69369B')
    backToForm(e, id)
  }

  return html`
    <li class="journey-summmary" onmouseover=${hover} onmouseout=${out}>
      <div class="journey-summary__general-infos">
        <span class="journey-summmary__duration">${simplifyDuration(duration)}</span>
        <span class="journey-summmary__distance"> ${simplifiedDistance}</span>
      </div>
      <div class="journey-summary__steps">
        <span class="journey-summmary__times">
          ${sections.map(journeySummarySectionComponent)} end
        </span>
      </div>
      <button class="standard-button" onClick=${save}>Save</button>
    </li>
  `
}

function journeySummarySectionComponent ({ departure_time, mode, transport_info }) {
  function displayTime (datetime) {
    const timeObj = new Date(datetime)
    return addLeadingZero(timeObj.getHours()) + 'h' + addLeadingZero(timeObj.getMinutes())
  }

  function addLeadingZero (number) {
    if (number < 10) {
      return '0' + number
    } else {
      return '' + number
    }
  }

  function iconFromTransport (mode) {
    switch (mode) {
      case 'walking':
        return 'pitch.svg'
      case 'public_transport':
        return 'bus.svg'
      default:
        return 'bicycle-share.svg'
    }
  }

  if (mode !== 'waiting' && mode !== 'transfer') {
    return html`
      ${displayTime(departure_time)} -> <img src="/static/images/maki/${iconFromTransport(mode)}"/> ${transport_info && transportNameComponent(transport_info || {})}->
    `
  }
}

function transportNameComponent ({ line_name: lineName, line_bg_color: bgColor, line_text_color: textColor, type }) {
  const style = {
    'background-color': bgColor || 'white',
    color: textColor || 'black'
  }
  return html`
    <div style=${style} class="transport-name">
    ${lineName}
    </div>
  `
}

// transport_info.line_name / line_bg_color / type
