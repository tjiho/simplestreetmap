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
    if (this.currentSearchMarker != null)
    {
	this.currentSearchMarker.parentNode.removeChild(this.currentSearchMarker);
    }
    this.currentSearchMarker = document.createElement('div');
    this.currentSearchMarker.className = 'marker';

    new mapboxgl.Marker(this.currentSearchMarker)
        .setLngLat([result.lon,result.lat])
        .addTo(map);

    this.map.flyTo({center: [result.lon,result.lat], zoom: 13});
  }

  search(query) {
    axios.get('https://nominatim.openstreetmap.org/search?format=json&q='+query)
    .then((response) => {
      this.cleanSearchResults()
      response.data.slice(0, 5).forEach( (res) => this.displaySearchResult(res))
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  }

  displaySearchResult(result) {
    let domResult = document.createElement("div")
    domResult.classList.add("search-results__result")
    domResult.innerText = result.display_name
    domResult.addEventListener("click", (e) => {
      this.clickOnResult(result)
    })
    document.getElementById("search-results").appendChild(domResult)
  }

  cleanSearchResults() {
    document.getElementById("search-results").innerHTML = ""
  }

}
