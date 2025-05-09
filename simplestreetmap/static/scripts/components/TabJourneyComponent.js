import { html, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js'

import SearchComponent from './SearchComponent.js'
// import map from '../singletons/map.js'
import { fetchItinerary } from '../tools/api.js'
import LoadingComponent from './LoadingComponent.js'
import simplifyDuration from '../tools/simplifyDuration.js'
// import toulousePau from '../constants/toulouse-pau.js'
import Journey from '../models/Journey.js'
import eventBus from '../singletons/eventBus.js'
import map from '../singletons/map.js'
import annotationStore from '../singletons/annotationsStore.js'
import translate from '../tools/translate.js'

const t = translate('TabJourneyComponent')

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
        <h2>${t('title')}</h2>
        <${JourneyFormComponent} onSubmit=${findJourney}/>
      `
    case 'list':
      return html`
        <h2>${t('title')}</h2>
        <${JourneyListComponent} from=${from} to=${to} mode=${mode} backToForm=${backToForm}/>
      `
    default:
      return html`
        <h2>${t('title')}</h2>
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
    if (from != null && to != null) {
      const mode = document.getElementById('journey-mode-input').value
      onSubmit(from, to, mode)
    }
    e.preventDefault()
    return false
  }

  return html`
    <form onSubmit=${_onSubmit}>
      <div class="form-field">
        <label for="journey-mode-input">${t('mode')}</label>
        <select name="mode" id="journey-mode-input">
          <option value="bike">${t('biking')}</option>
          <option value="public_transport">${t('public_transport')}</option>
          <option value="walk">${t('walking')}</option>
          <option value="camera">Walk without camera</option>
        </select>
      </div>
      <div class="form-field">
        <label for="journey-from-input">${t('start')}</label>
        <${SearchComponent} id="journey-from-input" onResultSelected="${AddStartPoint}" value=${searchFrom} onInput=${onInputFrom}/>
      </div>

      <div class="form-field">
        <label for="journey-to-input">${t('end')}</label>
        <${SearchComponent} id="journey-to-input" onResultSelected="${addEndPoint}" value=${searchTo} onInput=${onInputTo}/>
      </div>
      <input class="standard-button small-margin-top" type="submit" value="${t('search')}"/>
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
      _fitToMap(journeys)
    }).catch((error) => {
      console.error(error)
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

  function _fitToMap (journeys) {
    const bounds = new maplibregl.LngLatBounds(
      journeys[0].path.features[0].geometry.coordinates[0],
      journeys[0].path.features[0].geometry.coordinates[0]
    )

    for (const j of journeys) {
      for (const f of j.path.features) {
        if (f.geometry) {
          const coordinates = f.geometry.coordinates
          for (const coord of coordinates) {
            bounds.extend(coord)
          }
        }
      }
    }
    map.getMap().fitBounds(bounds, {
      padding: 200
    })
  }

  return (loading || !journeyList)
    ? LoadingComponent({})
    : html`
      <div>
        <h3>${t('from_to', { from: from.name, to: to.name })}</h3>
        <button onClick=${_backToForm} class="standard-button button--secondary">${t('look_for_another_itinerary')}</button>
        <ul class="journey-summmary-list">
          ${journeyList.map((j) => JourneySummaryComponent({
            id: j.id,
            distances: j.distances,
            duration: j.duration,
            sections: j.sections,
            saveToAnnotations: () => { annotationStore.addLocalAnnotation(j) },
            setColor: j.setColor.bind(j),
            moveOnTop: j.moveOnTop.bind(j),
            backToForm: _backToForm,
            key: j.id
          }))}
        </ul>
        ${journeyList.length === 0 && html`
          <p>${t('no_results')}</p>
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
      <button class="standard-button" onClick=${save}>${t('save')}</button>
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
    <div style="${style}" class="transport-name">
    ${lineName}
    </div>
  `
}
