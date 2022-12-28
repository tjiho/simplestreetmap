import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import { fetchSearchResult } from '../tools/api.js'

const CITY_TYPES = ['city', 'town', 'village'];

export default function search({onResultSelected = () => {}, id=""}) {
  // TODO: add a cross to clear the autocomplete
  // TODO: add keyboard navigation -> up/down to select, enter to validate, escape to close the autocomplete
  // TODO: add a loading indicator
  // TODO: add a "no result" message
  // TODO: darken the background when the autocomplete is open
  // TODO: highlight search term in the results
  // TODO: kill old requests when the user types something new

  const [results, setResults] = useState([]);

  function onInputSearch(e) {
		const searchValue = e.target.value

    fetchSearchResult(searchValue).then(setResults)
  }

  function blur(e) {
    setTimeout(() => setResults([]), 200) //to fix
  }

  return html`
      <div class="search-container" autoCompleted=${results.length > 0 ? 'true' : null}>
        <input type="search" id="${id}" onInput=${onInputSearch} onBlur=${blur} onFocus=${onInputSearch}/>
        <ul class="results">
          ${results.map(searchResult => result({...searchResult, onResultSelected}))}
        </ul>
      </div>
    `
}

function result({ type, name, coord, context, onResultSelected }) {
  const isCity = CITY_TYPES.includes(type);

  return html`
    <li onClick=${(e) => onResultSelected(coord, name)}>
      <span class="name">${name}</span>
      <span class="context">${context.join(', ')}</span>
      ${isCity ? html`<img src="/static/images/maki/${type}.svg" />` : ''}
    </li>
  `
}
