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
  // const [searchController, setSearchController] = useState(null);
  //const [searchValue, setSearchValue] = useState(initialSearchValue)

  function onInputSearch (e) {
    const inputValue = e.target.value
    //setSearchValue(inputValue)
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

  return html`
      <div class="search-container" autoCompleted=${results.length > 0 ? 'true' : null}>
        <input type="search" id="${id}" onInput=${onInputSearch} onBlur=${blur} onFocus=${onInputSearch} autocomplete="off" value=${value}/>
        <ul class="results">
          ${results.map(searchResult => result({ ...searchResult, onResultSelected: _onResultSelected }))}
        </ul>
      </div>
    `
}

function result ({ type, name, coord, context, onResultSelected }) {
  const isCity = CITY_TYPES.includes(type)

  return html`
    <li onClick=${(e) => onResultSelected(coord, name, context)}>
      <span class="name">${name}</span>
      <span class="context secondary-text">${context.join(', ')}</span>
      ${isCity ? html`<img src="/static/images/maki/${type}.svg" />` : ''}
    </li>
  `
}
