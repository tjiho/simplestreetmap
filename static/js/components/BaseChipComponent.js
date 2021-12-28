export class BaseChipComponent extends HTMLElement {
  constructor () {
    super()
    const template = document
      .getElementById('template-base-chip')
      .content
    const shadowRoot = this.attachShadow({ mode: 'open' })
      .appendChild(template.cloneNode(true))

    this.shadowRoot.querySelector('.chip_delete').addEventListener('click', (event) => {
      const deleteEvent = new Event('delete', {
        bubbles: true,
        cancelable: true,
        composed: true
      })
      this.shadowRoot.dispatchEvent(deleteEvent)
      event.stopPropagation()
    })
  }

  static get observedAttributes () {
    return ['name']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'name':
        this.shadowRoot.querySelector('.chip__name').innerText = newValue
        break
    }
  }
}
