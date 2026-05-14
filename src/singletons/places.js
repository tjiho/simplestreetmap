import map from './map.js'
import { searchByCoords } from '../api/search.js'

class Places {
  constructor (places) {
    const self = this // TODO: replace with bind
    this.parent = document.getElementById('places')
    this.selected = []
    this.OnSelected = []
    this.abortControllers = new Map()

    const currentPlaces = new URLSearchParams(window.location.search).getAll('places')

    map.on('load', function () {
      currentPlaces.forEach((place) => {
        const args = place.split(',')
        self.add(+args[0], +args[1], args[2]) // TODO: if bad args ?
      })
    })

    map.on('contextmenu', function (e) {
      self.add(e.lngLat.lat, e.lngLat.lng)
    })
  }

  add (lat, lng, name) {
    const element = document.createElement('c-place')
    if (name) {
      element.setAttribute('name', name)
    } else {
      const controller = new AbortController()
      const key = `${lat},${lng}`
      this.abortControllers.set(key, controller)
      
      searchByCoords(lat, lng, controller.signal)
        .then((value) => {
          element.setAttribute('name', value.features[0].properties.label)
          this.abortControllers.delete(key)
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Reverse search failed:', error)
          }
          this.abortControllers.delete(key)
        })
    }

    this.parent.appendChild(element)
    element.coordinates = { lat, lng }

    element.addEventListener('click', (e) => {
      this.selectPlace(e, element)
    })

    return element
  }

  selectPlace (event, element) {
    // unselect already selected place until ctrl-alt or maj
    this.selected.forEach((el) => el.removeAttribute('selected'))
    this.selected = []
    // select current place
    element.setAttribute('selected', '')
    this.selected.push(element)
    // do something else (display left panel)
  }
}

const places = new Places()
export default places
