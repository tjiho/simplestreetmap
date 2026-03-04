import { getLabel } from '../tools/poiLabel.js'
import OpeningHourComponent from './OpeningHourComponent.js'

class PoiViewer extends HTMLElement {
  constructor () {
    super()
    const tpl = document.getElementById('template-poi-viewer').content.cloneNode(true)
    this.appendChild(tpl)
  }

  set feature (feature) {
    this._feature = feature
    this.render()
  }

  get feature () {
    return this._feature
  }

  render () {
    const props = this._feature.properties
    console.log(props)
    this.querySelector('.poi-viewer__name').textContent = props['name:latin'] || props.name || ''

    this.querySelector('.poi-viewer__type').textContent = getLabel(props)

    if (props.website) {
      this.querySelector('.poi-viewer__website__link').href = props.website
      this.querySelector('.poi-viewer__website__link').textContent = props.website
    }

    if (props.opening_hours) {
      const openingHoursComponent = new OpeningHourComponent()
      openingHoursComponent.oh = props.opening_hours
      this.querySelector('.poi-viewer__opening-hour').appendChild(openingHoursComponent)
    }
  }
}

customElements.define('c-poi-viewer', PoiViewer)

export default PoiViewer
