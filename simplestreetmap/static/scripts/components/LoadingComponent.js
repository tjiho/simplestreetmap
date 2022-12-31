import { html } from '../../vendor/preact/standalone.module.js'

export default function LoadingComponent ({ title = 'Loading...' }) {
  return html`
    <div class="flex center">
        <h3>${title}</h3>
    </div>
    `
}
