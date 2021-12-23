import { Place } from './place.js'

export class Search {
  constructor (map) {
    this.lazySearch = _.debounce(this.search, 300)

    document.getElementById('search-input').addEventListener('input', (e) => {
      this.lazySearch(e.target.value)
    })

    this.currentSearchMarker = null
    this.map = map
  }

  clickOnResult (result) {
    new Place(this.map, result.geometry.coordinates[1], result.geometry.coordinates[0], result?.properties?.label)
    this.map.flyTo({ center: result.geometry.coordinates, zoom: 13 })
    this.cleanSearchResults()
  }

  search (query) {
    if (query && query['0'] === '#') {
      const coordinates = query.slice(1).split(',')
      this.cleanSearchResults()
      this.displaySearchResult({
        properties: {
          label: 'Coordinates' + coordinates['0'] + ':' + coordinates['1']
        },
        geometry: {
          coordinates
        }
      })
    } else {
      window.fetch('https://search.maps.ppsfleet.navy/search/?q=' + query).then((response) => {
        response.json().then((value) => {
          this.cleanSearchResults()
          value.features.slice(0, 5).forEach((res) => this.displaySearchResult(res))
        })
      }).catch(function (error) {
        // handle error
        console.log(error)
      })
    }
  }

  displaySearchResult (result) {
    const domResult = document.createElement('div')
    domResult.classList.add('search-results__result')
    domResult.innerText = result.properties.label
    domResult.addEventListener('click', (e) => {
      this.clickOnResult(result)
    })
    document.getElementById('search-results').appendChild(domResult)
  }

  cleanSearchResults () {
    document.getElementById('search-results').innerHTML = ''
  }
}
