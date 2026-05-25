import { html } from '../libs/preact.mjs'
import useSearch from '../hooks/useSearch.js'

export default function SearchComponent () {
  const {
    query,
    setQuery,
    results,
    selectedIndex,
    selectResult,
    submit,
    clear,
    handleKeyDown,
    runSearch
  } = useSearch()

  function handleSubmit (e) {
    e.preventDefault()
    submit()
  }

  return html`
    <div id="search-container" className=${results.length > 0 ? 'search-container--with-results' : ''}>
      <form className="search-container__top" onSubmit=${handleSubmit}>
        <label className="search-label">
          <img
            src="./static/images/helium/search.svg"
            className="search-label__icon"
            onClick=${() => query && runSearch(query)}
          />
          <input
            type="search"
            id="search-input"
            placeholder="search..."
            autocomplete="off"
            className="search-label__input"
            value=${query}
            onInput=${(e) => setQuery(e.target.value)}
            onKeyDown=${handleKeyDown}
          />
        </label>
      </form>
      <div id="search-results">
        ${results.map((result, index) => html`
          <div
            className="search-results__result"
            selected=${index === selectedIndex ? 'true' : undefined}
            onClick=${() => selectResult(result)}
          >
            ${result.properties.label}
          </div>
        `)}
      </div>
      ${results.length > 0 && html`
        <div className="search-container__bottom">
          <button type="button" id="search-close-button" onClick=${clear}>Fermer la recherche</button>
        </div>
      `}
    </div>
  `
}
