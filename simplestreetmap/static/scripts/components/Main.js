import { html, useEffect } from '../../../static/vendor/preact/standalone.module.js'

import map from '../singletons/map.js'
import TabsComponent from './TabsComponent.js'
import TabExploreComponent from './TabExploreComponent.js'
import TabJourneyComponent from './TabJourneyComponent.js'
import ListAnnotationsComponent from './ListAnnotationsComponent.js'

const tabs = [
  {
    icon: 'edit-find',
    label: 'Explore',
    content: TabExploreComponent,
    childProps: {},
    selected: true
  },
  {
    icon: 'compass',
    label: 'Journey',
    content: TabJourneyComponent,
    childProps: {}
  }
]

export default function Main () {
  // const mapContainerRef = useRef(null);

  useEffect(() => {
    const mapContainer = document.getElementById('map')
    map.initMap(mapContainer)
  }, [])

  return html`
        <main>
            <div id='map'></div>
            <div id="left-side-bar">
            <${TabsComponent} tabs="${tabs}" name="left-side-bar"/>
            </div>
            <div id="annotations">
            <${ListAnnotationsComponent}/>
            </div>
        </main>
    `
}
