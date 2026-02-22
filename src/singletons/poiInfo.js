import map from './map.js'
import overpassSearch from '../tools/overpassSearch.js'

const POI_LAYERS = ['poi-named']

class PoiInfo {
  constructor () {
    this.popup = null
    this.controller = null

    map.on('load', () => {
      this.addPoiLayer()

      // map.on('click', (e) => this.handleClick(e))

      // map.on('mousemove', (e) => {
      //   const features = map.queryRenderedFeatures(e.point, { layers: POI_LAYERS })
      //   map.getCanvas().style.cursor = features.length ? 'pointer' : ''
      // })
    })
  }

  addPoiLayer () {
    
    map.addSource("poi", {
        "type": "vector",
        "url": "pmtiles://http://localhost:12345/data/poi.pmtiles"
    })

    // map.addLayer({
    //   "id": "test-poi",
    //   "type": "circle",
    //   "source": "poi",
    //   "source-layer": "poi"
    // })


    map.addLayer({
      "id": "poi-named",
      "type": "symbol",
      "source": "poi",
      "source-layer": "poi",
      "minzoom": 15,
      "layout": {
        "icon-image": "restaurant-11",
        "icon-size": 1,
        "icon-allow-overlap": false,
        "text-padding": 2,
    "text-font": ["Open Sans Regular"],
    "text-anchor": "top",
    "text-field": [
      "case",
      ["has", "name:latin"],
      ["get", "name:latin"],
      ["get", "name"]
    ],
    "text-optional": true,
    "text-offset": [0, 1.4],
    "text-size": 10,
    "text-max-width": 9
      },
      "paint": {
        "text-color": "#333",
        "text-halo-color": "#fff",
        "text-halo-width": 1.5
      }
    })

    // map.addLayer({
    //   id: 'poi-named',
    //   type: 'symbol',
    //   source: 'poi',
    //   'source-layer': 'poi',
    //   minzoom: 15,
    //   filter: ['all', ['==', '$type', 'Point'], ['has', 'name']],
    //   layout: {
    //     'icon-image': ['match', ['get', 'amenity'],
    //       'restaurant', 'restaurant-11',
    //       'cafe', 'cafe-11',
    //       'fast_food', 'fast-food-11',
    //       'bar', 'bar-11',
    //       'bakery', 'bakery-11',
    //       'bank', 'bank-11',
    //       'pharmacy', 'pharmacy-11',
    //       'hospital', 'hospital-11',
    //       'school', 'school-11',
    //       'fuel', 'fuel-11',
    //       'parking', 'parking-11',
    //       'cinema', 'cinema-11',
    //       'theatre', 'theatre-11',
    //       'museum', 'museum-11',
    //       'hotel', 'lodging-11',
    //       'supermarket', 'grocery-11',
    //       'convenience', 'grocery-11',
    //       'clothes', 'clothing-store-11',
    //       'hairdresser', 'hairdresser-11',
    //       'place_of_worship', 'place-of-worship-11',
    //       'park', 'park-alt1-11',
    //       'library', 'library-11',
    //       'post_office', 'post-11',
    //       'police', 'police-11',
    //       'toilets', 'toilet-11',
    //       'marker2-11'
    //     ],
    //     'icon-size': 1,
    //     'icon-allow-overlap': false,
    //     'text-field': ['get', 'name'],
    //     'text-size': 12,
    //     'text-offset': [0, 1.2],
    //     'text-anchor': 'top',
    //     'text-max-width': 8,
    //     'text-optional': true
    //   },
    //   paint: {
    //     'text-color': '#333',
    //     'text-halo-color': '#fff',
    //     'text-halo-width': 1.5
    //   }
    // })
  }

  handleClick (e) {
    const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]]
    const features = map.queryRenderedFeatures(bbox, { layers: POI_LAYERS })

    if (!features.length) {
      this.closePopup()
      return
    }

    const feature = features[0]
    const props = feature.properties
    const coords = feature.geometry.coordinates.slice()

    this.showPopup(coords, this.buildLoadingContent(props))

    if (this.controller) this.controller.abort()
    this.controller = new AbortController()

    if (feature.id) {
      overpassSearch(feature.id, this.controller.signal)
        .then(element => {
          if (element && element.tags) {
            this.showPopup(coords, this.buildFullContent(element))
          } else {
            this.showPopup(coords, this.buildTileContent(props))
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            this.showPopup(coords, this.buildTileContent(props))
          }
        })
    } else {
      this.showPopup(coords, this.buildTileContent(props))
    }
  }

  showPopup (coords, html) {
    this.closePopup()
    this.popup = new maplibregl.Popup({ maxWidth: '320px', className: 'poi-popup' })
      .setLngLat(coords)
      .setHTML(html)
      .addTo(map)
  }

  closePopup () {
    if (this.popup) {
      this.popup.remove()
      this.popup = null
    }
  }

  buildLoadingContent (props) {
    const name = props.name || props.subclass || ''
    return `<div class="poi-popup__content">
      <strong class="poi-popup__name">${this.escape(name)}</strong>
      <span class="poi-popup__class">${this.escape(props.subclass || props.class || '')}</span>
      <div class="poi-popup__loading">Chargement...</div>
    </div>`
  }

  buildTileContent (props) {
    const name = props.name || props.subclass || ''
    return `<div class="poi-popup__content">
      <strong class="poi-popup__name">${this.escape(name)}</strong>
      <span class="poi-popup__class">${this.escape(props.subclass || props.class || '')}</span>
    </div>`
  }

  buildFullContent (element) {
    const tags = element.tags
    const lines = []

    lines.push(`<strong class="poi-popup__name">${this.escape(tags.name || '')}</strong>`)

    const type = tags.amenity || tags.shop || tags.tourism || tags.leisure || ''
    if (type) {
      lines.push(`<span class="poi-popup__class">${this.escape(type)}</span>`)
    }

    const details = []
    if (tags.opening_hours) details.push(this.detail('Horaires', tags.opening_hours))
    if (tags.phone || tags['contact:phone']) details.push(this.detail('Tél', tags.phone || tags['contact:phone']))
    if (tags.website || tags['contact:website']) {
      const url = tags.website || tags['contact:website']
      details.push(`<div class="poi-popup__detail"><span class="poi-popup__label">Web :</span> <a href="${this.escape(url)}" target="_blank" rel="noopener">${this.escape(this.shortenUrl(url))}</a></div>`)
    }
    if (tags.cuisine) details.push(this.detail('Cuisine', tags.cuisine))
    if (tags['addr:street']) {
      const addr = [tags['addr:housenumber'], tags['addr:street'], tags['addr:postcode'], tags['addr:city']].filter(Boolean).join(', ')
      details.push(this.detail('Adresse', addr))
    }

    if (details.length) {
      lines.push(`<div class="poi-popup__details">${details.join('')}</div>`)
    }

    const osmLink = `https://www.openstreetmap.org/${element.type}/${element.id}`
    lines.push(`<a class="poi-popup__osm-link" href="${osmLink}" target="_blank" rel="noopener">Voir sur OpenStreetMap</a>`)

    return `<div class="poi-popup__content">${lines.join('')}</div>`
  }

  detail (label, value) {
    return `<div class="poi-popup__detail"><span class="poi-popup__label">${this.escape(label)} :</span> ${this.escape(value)}</div>`
  }

  shortenUrl (url) {
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  }

  escape (str) {
    const el = document.createElement('span')
    el.textContent = str
    return el.innerHTML
  }
}

const poiInfo = new PoiInfo()
export default poiInfo
