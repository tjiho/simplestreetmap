import { html, Component, render, createContext, useState, useEffect } from '../../../static/vendor/preact/standalone.module.js';
import { fetchSearchResult } from '../tools/api.js'

export default function search() {
  const [results, setResults] = useState(0);


  


  async function onInputSearch(e) {
		console.log(e)
		const searchValue = e.target.value
		useEffect(() => {
    	const results = await fetchSearchResult(searchValue)
    	setResults(results)
  	}, []);
  }


  return html`
      <div>
        <input type="search" onInput=${}/>
        <div class="results">	
        </div>
      </div>
    `
}



