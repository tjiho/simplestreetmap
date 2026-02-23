class PoiPanelElement extends HTMLElement {
  open (element) {
    this.innerHTML = ''
    this.appendChild(element)
    this.classList.add('poi-panel--open')
  }

  close () {
    this.classList.remove('poi-panel--open')
    this.innerHTML = ''
  }
}

customElements.define('c-poi-panel', PoiPanelElement)

const poiPanel = document.querySelector('c-poi-panel')
export default poiPanel
