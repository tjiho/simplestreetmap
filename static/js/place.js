customElements.define('place-chip',
  class extends HTMLElement {
    constructor () {
      super()
      const template = document
        .getElementById('template-place-chip')
        .content
      const shadowRoot = this.attachShadow({ mode: 'open' })
        .appendChild(template.cloneNode(true))
    }

    static get observedAttributes () {
      return ['name']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      console.log(this.shadowRoot)
      switch (name) {
        case 'name':
          this.shadowRoot.querySelector('.place-chip__name').innerText = newValue
          break
      }
    }
  }
)

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
    this.queryName(name, parent)
  }

  generateChipDom (name) {
    const element = document.createElement('place-chip')
    element.setAttribute('name', name)
    element.addEventListener('click', (e) => {
      this.map.flyTo({ center: [this.lng, this.lat], zoom: 13 })
    })
    return element
  }

  queryName (name, parent) {
    if (name) {
      this.name = name
      this.chip = this.generateChipDom(this.name)
      parent.appendChild(this.chip)
    } else {
      window.fetch(`https://search.maps.ppsfleet.navy/reverse?lat=${this.lat}&lon=${this.lng}`).then((response) => {
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
