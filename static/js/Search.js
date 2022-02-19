import { Place } from './Place.js'
import { debounce } from './tools/debounce.js'

export class Search {
  constructor (map) {
    this.lazySearch = debounce(this.search.bind(this), 300)

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
      // don't do concurent search, abort previous search
      if (this.searchController) { this.searchController.abort() }
      this.searchController = new AbortController()
      const signal = this.searchController.signal

      window.fetch(BASE_SEARCH_URL(query), { signal }).then((response) => {
        response.json().then((value) => {
          this.cleanSearchResults()
          value?.features && value.features.slice(0, 5).forEach((res) => this.displaySearchResult(res))
        })
      }).catch(function (error) {
        // handle error
        console.log(error)
      })
    }
  }

  displaySearchResult (result) {
    const domResult = document.createElement('div')
    document.getElementById('search-input').parentNode.classList.add('search-label--with-results')
    domResult.classList.add('search-results__result')
    domResult.innerText = result.properties.label
    domResult.addEventListener('click', (e) => {
      this.clickOnResult(result)
    })
    document.getElementById('search-results').appendChild(domResult)
  }

  cleanSearchResults () {
    document.getElementById('search-results').innerHTML = ''
    document.getElementById('search-input').parentNode.classList.remove('search-label--with-results')

  }
}
