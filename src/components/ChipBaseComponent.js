export default class ChipBaseComponent extends HTMLElement {
  constructor () {
    super()
    const template = document
      .getElementById('template-chip-base')
      .content
    this.attachShadow({ mode: 'open' })
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

    this.setName(this.getAttribute('name'))
  }

  static get observedAttributes () {
    return ['name']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'name':
        this.setName(newValue)
        break
    }
  }

  setName (name) {
    if (name) {
      this.shadowRoot.querySelector('.chip__name').innerText = name
    }
  }
}
