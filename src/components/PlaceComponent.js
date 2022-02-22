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

  set coordinates ({ lat, lng }) {
    this._lat = lat
    this._lng = lng
    this.addMarker(lat, lng)
    //this.updateUrl(lat,lng)
  }

  set name(name) {
    if(name)
    {
      super.name = name
    }
  }
  get coordinates () {
    return { lat: this._lat, lng: this._lng }
  }

  addMarker (lat, lng) {
    this?.marker?.remove()
    this.marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map)
  }

  updateUrl(lat,lng) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.append('places', `${lat},${lng},${name}`);
    history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)
  }
}
