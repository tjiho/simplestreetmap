import map from './map.js'
import poiPanel from './poiPanel.js'
import { render, html } from '../libs/preact.mjs'
import PoiViewer from '../components/PoiViewer.js'
import poiLayer from './layers/poi.js'
import { searchById } from '../api/search.js'

class PoiInfo {
  constructor () {
    this.popup = null
    this.controller = null

    map.on('load', () => {
      map.on('click', (e) => this.handleClick(e))

      map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: poiLayer.layersIds
        })
        map.getCanvas().style.cursor = features.length ? 'pointer' : ''
      })
    })
  }

  handleClick (e) {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5]
    ]
    const features = map.queryRenderedFeatures(bbox, { layers: poiLayer.layersIds })

    if (!features.length) {
      this.closePopup()
      poiPanel.close()
      return
    }

    const feature = features[0]
    const container = document.createElement('div')
    render(html`<${PoiViewer} feature=${feature} />`, container)
    poiPanel.open(container)
  }

  showPopup (coords, html) {
    this.closePopup()
    this.popup = new maplibregl.Popup({
      maxWidth: '320px',
      className: 'poi-popup'
    })
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
}

const poiInfo = new PoiInfo()
export default poiInfo
