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

    this.name = this.getAttribute('name')
  }

  static get observedAttributes () {
    return ['name']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if(oldValue !== newValue)
    {
      console.log(oldValue)
      console.log(newValue)
      switch (name) {
        case 'name':
          this.name = newValue
          break
      }
    }
  }

  set name (name) {
    if (name) {
      this.shadowRoot.querySelector('.chip__name').innerText = name
      this._name = name
    }
  }
}
