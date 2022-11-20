import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import { fetchSearchResult } from '../tools/api.js'

const CITY_TYPES = ['city', 'town', 'village'];

export default function search({onResultSelected = () => {}, id=""}) {
  const [results, setResults] = useState([]);

  function onInputSearch(e) {
		const searchValue = e.target.value

    fetchSearchResult(searchValue).then(setResults)
  }

  return html`
      <div class="search-container">
        <input type="search" id="${id}" onInput=${onInputSearch}/>
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
