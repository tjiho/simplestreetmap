import { html, useEffect, useState } from '../../../static/vendor/preact/standalone.module.js'
import eventBus from '../singletons/eventBus.js'
import webSocketClient from '../singletons/webSocketClient.js'
import translate from '../tools/translate.js'

const t = translate('TabShareComponent')

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
    <h2>${t('title')}</h2>
    <p>
     ${t('notConnected_1')}
    </p>
    <p>
      ${t('notConnected_2')}
    </p>
  `
: html`
    <h2>${t('title')}</h2>
    <p>
    ${t('connected_1')}
    </p>
    <${ShareLinkComponent} label='${t('public_link')}' link='${urlRead}'/>

    ${canEdit ? html`<${ShareLinkComponent}  label='${t('private_link')}' link='${urlWrite}'/>` : null}
  `}`
}

function ShareLinkComponent ({ label, link }) {
  const [buttonValue, setButtonValue] = useState(t('copy'))

  function copyToClipboard (e) {
    const input = e.target.parentNode.parentNode.querySelector('input')
    input.select()
    input.setSelectionRange(0, 99999)
    document.execCommand('copy')
    setButtonValue(t('copied!'))
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
