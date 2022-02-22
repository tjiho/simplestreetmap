import reverseSearch from '../tools/reverseSearch.js'

class Places {
  constructor (places) {
    this.parent = document.getElementById('places')
    this.selected = []
  }

  add (lat, lng, name) {
    const element = document.createElement('c-place')
    name ? element.setAttribute('name', name) : reverseSearch(lat, lng, (value) => { element.setAttribute('name', value.features[0].properties.label) })
    this.parent.appendChild(element)
    element.coordinates = { lat, lng }

    element.addEventListener('click',(e) => {
      console.log('yo')
      this.selectPlace(e,element)
    })

    return element
  }

  selectPlace(event, element) {
    //element.setAttribute('selected', '')
  }
}
console.log(new URLSearchParams(window.location.search).getAll('places'))
const places = new Places()
export default places
