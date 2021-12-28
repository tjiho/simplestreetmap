// TODO: replace it with a fonction ?
export class Place {
  constructor (map, lat, lng, name, parent = document.getElementById('places')) {
    this.map = map
    this.lat = lat
    this.lng = lng
    this.marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(this.map)
    this.show = true
    this.itinerary = null
    this.parent = parent
    this.queryName(name, parent)
  }

  generateChipDom (name, parent) {
    const element = document.createElement('base-chip')
    element.setAttribute('name', name)
    element.addEventListener('delete', (e) => {
      element.remove()
      this.marker.remove()
    })
    element.addEventListener('click', (e) => {
      this.map.flyTo({ center: [this.lng, this.lat], zoom: 13 })
    })
    return element
  }

  queryName (name, parent) {
    if (name) {
      this.name = name
      this.chip = this.generateChipDom(name, parent)
      parent.appendChild(this.chip)
    } else {
      window.fetch(BASE_REVERSE_URL(this.lat,this.lng)).then((response) => {
        response.json().then((value) => {
          console.log(value)
          this.name = value.features[0].properties.label
          this.chip = this.generateChipDom(this.name)
          parent.appendChild(this.chip)
        })
      })
    }
  }
}
