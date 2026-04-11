import map from './map.js'

const container = document.getElementById('layer-switcher')
const buttons = container.querySelectorAll('.layer-switcher__option')

const params = new URLSearchParams(window.location.search)
let active = params.get('layer') === 'satellite' ? 'satellite' : 'plan'

container.querySelector(`[data-layer="${active}"]`).classList.add('layer-switcher__option--active')

buttons.forEach(btn => {
  btn.addEventListener('click', () => setLayer(btn.dataset.layer))
})

map.on('load', () => {
  map.addSource('satellite', {
    type: 'raster',
    tiles: [
      'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
      '&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg' +
      '&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
    ],
    tileSize: 256,
    attribution: '© IGN-Géoportail'
  })

  map.addLayer({
    id: 'satellite',
    type: 'raster',
    source: 'satellite',
    layout: {
      visibility: active === 'satellite' ? 'visible' : 'none'
    }
  })
})

function setLayer (name) {
  if (name === active) return
  active = name

  buttons.forEach(btn => {
    btn.classList.toggle('layer-switcher__option--active', btn.dataset.layer === name)
  })

  map.setLayoutProperty('satellite', 'visibility', name === 'satellite' ? 'visible' : 'none')

  const searchParams = new URLSearchParams(window.location.search)
  if (name === 'satellite') {
    searchParams.set('layer', 'satellite')
  } else {
    searchParams.delete('layer')
  }
  window.history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)
}

export default { setLayer }
