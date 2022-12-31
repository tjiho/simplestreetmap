import reverseSearch from '../tools/reverseSearch.js'
import map from './map.js'

class Places {
  constructor (places) {
    const self = this // TODO: replace with bind
    this.parent = document.getElementById('places')
    this.selected = []
    this.OnSelected = []

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
      reverseSearch(+lat, +lng, (value) => {
        element.setAttribute('name', value.features[0].properties.label)
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
