import { html, useState } from '../../../static/vendor/preact/standalone.module.js'
import { fetchSearchResult } from '../tools/api.js'
import debounce from '../tools/debounce.js'

const debounceSearch = debounce(fetchSearchResult, 300)
const CITY_TYPES = ['city', 'town', 'village']

export default function SearchComponent ({ onResultSelected = () => {}, id = '', value = '', onInput = () => {} }) {
  // TODO: add a cross to clear the autocomplete
  // TODO: add keyboard navigation -> up/down to select, enter to validate, escape to close the autocomplete
  // TODO: add a loading indicator
  // TODO: add a "no result" message
  // TODO: darken the background when the autocomplete is open
  // TODO: highlight search term in the results
  // TODO: kill old requests when the user types something new

  const [results, setResults] = useState([])
  const [selectedresult, setSelectedResult] = useState(0)
  // const [searchController, setSearchController] = useState(null);
  // const [searchValue, setSearchValue] = useState(initialSearchValue)

  function onInputSearch (e) {
    const inputValue = e.target.value
    // setSearchValue(inputValue)
    onInput(e)
    // if (searchController) { searchController.abort() }
    // setSearchController(new AbortController())
    // const signal = searchController.signal

    debounceSearch(inputValue).then(setResults)
  }

  function _onResultSelected (coord, name, context) {
    onResultSelected(coord, name, context)
    setResults([])
    onInput({ target: { value: name } })
  }

  function blur (e) {
    setTimeout(() => setResults([]), 300) // to fix
  }

  function _setSelectedResult (index) {
    if (index < 0) {
      setSelectedResult(results.length - 1)
    } else if (index >= results.length) {
      setSelectedResult(0)
    } else {
      setSelectedResult(index)
    }
  }

  function keydown (e) {
    if (e.key === 'ArrowDown') {
      _setSelectedResult(selectedresult + 1)
    }
    if (e.key === 'ArrowUp') {
      _setSelectedResult(selectedresult - 1)
    }
    if (e.key === 'Enter') {
      _onResultSelected(results[selectedresult].coord, results[selectedresult].name, results[selectedresult].context)
    }
  }

  return html`
      <div class="search-container" autoCompleted=${results.length > 0 ? 'true' : null} onkeydown=${keydown}>
        <input type="search" id="${id}" onInput=${onInputSearch} onBlur=${blur} onFocus=${onInputSearch} autocomplete="off" value=${value}/>
        <ul class="results">
          ${results.map((searchResult, index) => result({ ...searchResult, onResultSelected: _onResultSelected, selected:index === selectedresult }))}
        </ul>
      </div>
    `
}

function result ({ type, name, coord, context, onResultSelected, selected }) {
  const isCity = CITY_TYPES.includes(type)

  return html`
    <li onClick=${(e) => onResultSelected(coord, name, context)} selected=${selected}>
      <span class="name">${name}</span>
      <span class="context secondary-text">${context.join(', ')}</span>
      ${isCity ? html`<img src="/static/images/maki/${type}.svg" />` : ''}
    </li>
  `
}
