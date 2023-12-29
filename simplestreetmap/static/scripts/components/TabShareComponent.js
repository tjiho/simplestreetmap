import { html, useEffect, useState } from '../../../static/vendor/preact/standalone.module.js'
import eventBus from '../singletons/eventBus.js'
import webSocketClient from '../singletons/webSocketClient.js'

export default function TabShareComponent ({ canEdit, local }) {
  // const urlRead = new URLSearchParams(window.location.search)
  // urlRead.set('token', webSocketClient.readToken)

  // const urlWrite = new URLSearchParams(window.location.search)
  // urlWrite.set('token', webSocketClient.writeToken)

  const [urlRead, setUrlRead] = useState(null)
  const [urlWrite, setUrlWrite] = useState(null)

  function updateUrls () {
    const urlReadLocal = new URLSearchParams(window.location.search)
    urlReadLocal.set('token', webSocketClient.readToken)
    setUrlRead(`${document.location.origin}${document.location.pathname}?${urlReadLocal}`)

    const urlWriteLocal = new URLSearchParams(window.location.search)
    urlWriteLocal.set('token', webSocketClient.writeToken)
    setUrlWrite(`${document.location.origin}${document.location.pathname}?${urlWriteLocal}`)
  }

  useEffect(() => {
    updateUrls()

    eventBus.on('websocket-hello', updateUrls)

    return () => {
      eventBus.off('websocket-hello', updateUrls)
    }
  }, [])

  useEffect(() => {
    console.log(local)
  }, [local])

  return html`${local
? html`
    <h2>Share your map</h2>
    <p>
      You are not connected to the server
    </p>
    <p>
      You can still use the map, but you will not be able to share it with others.
    </p>
  `
: html`
    <h2>Share your map</h2>
    <p>
    You can share your map by copying one of the two links above:
    </p>
    <${ShareLinkComponent} label='Public link (read-only):' link='${urlRead}'/>

    ${canEdit ? html`<${ShareLinkComponent}  label='Private link (read-write):' link='${urlWrite}'/>` : null}
  `}`
}

function ShareLinkComponent ({ label, link }) {
  const [buttonValue, setButtonValue] = useState('Copy')

  function copyToClipboard (e) {
    const input = e.target.parentNode.parentNode.querySelector('input')
    input.select()
    input.setSelectionRange(0, 99999)
    document.execCommand('copy')
    setButtonValue('Copied!')
    setTimeout(() => {
      setButtonValue('Copy')
    }
    , 3000)
  }

  // useEffect(async () => {
  //
  // }, [])

  return html`
        <div class="share-link form-field">
            <label for="${label}">${label}</label>
            <div class="share-link__input-line">
                <input id="${label}" type="text" value="${link}" readonly/>
                <button onClick=${copyToClipboard} class="standard-button">${buttonValue}</button>
            </div>
        </div>
    `
}
