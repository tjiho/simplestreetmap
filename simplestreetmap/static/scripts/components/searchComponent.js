import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import { fetchSearchResult } from '../tools/api.js'

const CITY_TYPES = ['city', 'town', 'village'];

export default function search(onResultSelected = () => {}) {
  const [results, setResults] = useState([]);

  function onInputSearch(e) {
		const searchValue = e.target.value

    fetchSearchResult(searchValue).then(setResults)
  }

  return html`
      <div>
        <input type="search" onInput=${onInputSearch}/>
        <ul class="results">
          ${results.map(searchResult => result({...searchResult, onResultSelected}))}
        </ul>
      </div>
    `
}

function result({ type, name, coord, context, onResultSelected }) {
  const isCity = CITY_TYPES.includes(type);

  return html`
    <li>
      ${name}
      <span class="context" onClick=${(e) => onResultSelected(coord)}>${context.join(', ')}</span>
      ${isCity ? html`<img src="/static/images/helium/home.svg" />` : ''}
    </li>
  `
}
