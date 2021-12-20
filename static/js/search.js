class Search {
  constructor(map) {
    this.lazySearch = _.debounce(this.search, 300)

    document.getElementById("search-input").addEventListener("input", (e) => {
      this.lazySearch(e.target.value)
    });

    this.currentSearchMarker = null
    this.map = map
  }

  clickOnResult(result) {
    if (this.currentSearchMarker != null) {
      this.currentSearchMarker.parentNode.removeChild(this.currentSearchMarker);
    }
    this.currentSearchMarker = document.createElement('div');
    this.currentSearchMarker.className = 'marker';

    new mapboxgl.Marker(this.currentSearchMarker)
        .setLngLat(result.geometry.coordinates)
        .addTo(map);

    this.map.flyTo({center: result.geometry.coordinates, zoom: 13});
    
    this.cleanSearchResults();
  }

  search(query) {
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
      axios.get('https://search.maps.ppsfleet.navy/search/?q='+query)
      .then((response) => {
        this.cleanSearchResults()
        response.data.features.slice(0, 5).forEach( (res) => this.displaySearchResult(res))
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    }
  }

  displaySearchResult(result) {
    let domResult = document.createElement("div")
    domResult.classList.add("search-results__result")
    domResult.innerText = result.properties.label
    domResult.addEventListener("click", (e) => {
      this.clickOnResult(result)
    })
    document.getElementById("search-results").appendChild(domResult)
  }

  cleanSearchResults() {
    document.getElementById("search-results").innerHTML = ""
  }

}
