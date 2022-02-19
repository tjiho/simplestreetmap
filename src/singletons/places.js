import reverseSearch from '../tools/reverseSearch.js'

class Places {
  constructor () {
    this.parent = document.getElementById('places')
  }

  add (lat, lng, name) {
    const element = document.createElement('c-place')
    name ? element.setAttribute('name', name) : reverseSearch(lat, lng, (value) => { element.setAttribute('name', value.features[0].properties.label) })
    this.parent.appendChild(element)
    element.coordinates = { lat, lng }
    return element
  }
}

const places = new Places()
export default places
