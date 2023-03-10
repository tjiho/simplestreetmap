import map from '../singletons/map.js'
import ChipBaseComponent from './ChipBaseComponent.js'

export default class PlaceComponent extends ChipBaseComponent {
  constructor () {
    super()

    this.addEventListener('delete', (e) => {
      this.marker.remove()
      this.remove()
    })

    this.addEventListener('click', (e) => {
      map.flyTo({ center: [this._lng, this._lat], zoom: 13 })
    })
  }

  set name (name) {
    if (name) {
      super.name = name
      this.updateUrl()
    }
  }

  set coordinates ({ lat, lng }) {
    this._lat = lat
    this._lng = lng
    this.addMarker(lat, lng)
    this.updateUrl()
  }

  get coordinates () {
    return { lat: this._lat, lng: this._lng }
  }

  addMarker (lat, lng) {
    this?.marker?.remove()
    this.marker = new maplibregl.Marker()
      .setLngLat([lng, lat])
      .addTo(map)
  }

  updateUrl () {
    if (this._name && this._lat && this._lng) {
      const urlParams = new URLSearchParams(window.location.search)
      if (!urlParams.getAll('places').find((place) => place === `${this._lat},${this._lng},${this._name}`)) {
        urlParams.append('places', `${this._lat},${this._lng},${this._name}`)
        history.replaceState(null, null, `${document.location.pathname}?${urlParams}`)
      }
    }
  }

  remove () {
    const urlParams = new URLSearchParams(window.location.search)
    const places = urlParams.getAll('places')
    const placesWithoutSelf = places.filter((place) => place !== `${this._lat},${this._lng},${this._name}`)

    urlParams.delete('places', placesWithoutSelf)
    placesWithoutSelf.forEach((place) => urlParams.append('places', place))

    history.replaceState(null, null, `${document.location.pathname}?${urlParams}`)

    super.remove()
  }
}
