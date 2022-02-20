import debounce from '../tools/debounce.js'
import map from './map.js'
import places from './places.js'

export class Search {
  constructor () {
    this.lazySearch = debounce(this.search.bind(this), 300)

    document.getElementById('search-input').addEventListener('input', (e) => {
      this.lazySearch(e.target.value)
    })
    
    document.getElementById('search-close-button').addEventListener('click', (e) => {
      this.cleanSearchResults()
    })
    
    document.getElementById('search-button').addEventListener('click', (e) => {
        console.log('yop')
      this.lazySearch(document.getElementById('search-input').value)
    })
    
    this.currentSearchMarker = null
    this.map = map
    
  }

  clickOnResult (result) {
    places.add(result.geometry.coordinates[1], result.geometry.coordinates[0], result?.properties?.label)
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
    document.getElementById('search-container').classList.add('search-container--with-results')
    domResult.classList.add('search-results__result')
    domResult.innerText = result.properties.label
    domResult.addEventListener('click', (e) => {
      this.clickOnResult(result)
    })
    document.getElementById('search-results').appendChild(domResult)
  }

  cleanSearchResults () {
    document.getElementById('search-results').innerHTML = ''
    document.getElementById('search-container').classList.remove('search-container--with-results')
  }
}

const search = new Search()
export default search
