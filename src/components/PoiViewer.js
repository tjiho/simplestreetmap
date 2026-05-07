import { html } from '../libs/preact.mjs'
import { getLabel } from '../tools/poiLabel.js'
import OpeningHourComponent from './OpeningHourComponent.js'

export default function PoiViewer ({ feature }) {
  if (!feature) return null

  const props = feature.properties
  
  return html`
    <div class="poi-viewer__content">
      <h2 class="poi-viewer__name">${props['name:latin'] || props.name || ''}</h2>
      <div class="poi-viewer__type">${getLabel(props)}</div>
      <div class="poi-viewer__website">
        ${props.website 
          ? html`<a class="poi-viewer__website__link" href="${props.website}">${props.website}</a>`
          : null
        }
      </div>
      <div class="poi-viewer__opening-hour">
        ${props.opening_hours 
          ? html`<${OpeningHourComponent} oh=${props.opening_hours} />`
          : null
        }
      </div>
      <div class="poi-viewer__all"></div>
    </div>
  `
}
