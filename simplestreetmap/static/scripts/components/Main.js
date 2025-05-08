import { html, useEffect, useState } from '../../../static/vendor/preact/standalone.module.js'

import map from '../singletons/map.js'
import TabsComponent from './TabsComponent.js'
import TabExploreComponent from './TabExploreComponent.js'
import TabJourneyComponent from './TabJourneyComponent.js'
import ListAnnotationsComponent from './ListAnnotationsComponent.js'
import AnnotationsMobileComponent from './AnnotationsMobileComponent.js'
import TabSettingsComponent from './TabSettingsComponent.js'
import TabShareComponent from './TabShareComponent.js'
import eventBus from '../singletons/eventBus.js'
import webSocketClient from '../singletons/webSocketClient.js'

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
  },
  {
    icon: 'document-share',
    label: 'Share',
    content: TabShareComponent,
    childProps: {}
  },
  {
    icon: 'configure',
    label: 'Settings',
    content: TabSettingsComponent,
    childProps: {}
   },

]

export default function Main () {
  // const mapContainerRef = useRef(null);
  const [loaded, setLoaded] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [local, setLocal] = useState(false)
  const [displayAnnotations, setDisplayAnnotations] = useState(false)

  useEffect(() => {
    const mapContainer = document.getElementById('map')
    map.initMap(mapContainer)

    eventBus.on('websocket-update-state', () => {
      setCanEdit(webSocketClient.canEdit)
      setLoaded(!webSocketClient.isConnecting)
      setLocal(webSocketClient.isLocal)
    })
  }, [])

  function closeAnnotationMobile () {
    setDisplayAnnotations(false)
  }

  return html`
        <main>
            ${!loaded
            ? html`
              <div id="loading-screen">
                <div id="loading-screen__title">Connecting to server and loading map...</div>
              </div>
            `
            : null}
            <div id='map'></div>
            <div id="left-side-bar">
            ${loaded
            ? html`
              <${TabsComponent} tabs="${tabs}" name="left-side-bar" canEdit=${canEdit} local=${local}/>
            `
            : html`
              <div>Connecting to server...</div>
            `}
            </div>
            <${AnnotationsMobileComponent} setDisplayAnnotations=${setDisplayAnnotations} local=${local}/>
            <div id="annotations" visible=${displayAnnotations}>
              <button id="close-annotation-panel" onclick=${closeAnnotationMobile} class="standard-button button--secondary">
                Close annotations
              </button>
              <div class="connection-infos ${local ? 'connection-infos--local' : canEdit ? 'connection-infos--edit' : 'connection-infos--read'}">
                <div>${local ? 'You are not connected.' : 'You are connected.'}</div>
                <div>${canEdit ? 'You can edit the map.' : "Your are in read only mode, your change won't be synced."}</div>
              </div>
              <${ListAnnotationsComponent}/>
            </div>
        </main>
    `
}
