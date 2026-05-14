import { html } from '../libs/preact.mjs'
import { useState, useEffect, useRef, useCallback } from '../libs/preact.mjs'
import debounce from '../tools/debounce.js'
import { searchByName } from '../api/search.js'
import map from '../singletons/map.js'
import places from '../singletons/places.js'

/**
 * Composant Preact pour la recherche uniquement
 * Gère : input, résultats, sélection clavier, requêtes API
 */
export default function SearchComponent() {
  // State
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  // Ref pour AbortController
  const searchController = useRef(null)

  // Handlers
  const handleInput = useCallback((e) => {
    setQuery(e.target.value)
    setSelectedIndex(-1)
  }, [])

  const handleClose = useCallback(() => {
    setQuery('')
    setResults([])
    setSelectedIndex(-1)
  }, [])

  const handleResultClick = useCallback((result) => {
    places.add(result.geometry.coordinates[1], result.geometry.coordinates[0], result?.properties?.label)
    map.flyTo({ center: result.geometry.coordinates, zoom: 13 })
    handleClose()
  }, [handleClose])

  const handleKeyDown = useCallback((e) => {
    if (results.length === 0) return

    switch (e.keyCode) {
      case 40: // ArrowDown
        e.preventDefault()
        setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : 0)
        break
      case 38: // ArrowUp
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : results.length - 1)
        break
      case 13: // Enter
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex])
        } else if (results.length > 0) {
          handleResultClick(results[0])
        }
        break
      case 27: // Escape
        handleClose()
        break
    }
  }, [results, selectedIndex, handleResultClick, handleClose])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      // Handle special case: #lat,lng
      if (query && query[0] === '#') {
        const coordinates = query.slice(1).split(',')
        setResults([{
          properties: {
            label: 'Coordinates: ' + coordinates[0] + ',' + coordinates[1]
          },
          geometry: {
            coordinates: [parseFloat(coordinates[1]), parseFloat(coordinates[0])]
          }
        }])
        return
      }

      // Abort previous request
      if (searchController.current) {
        searchController.current.abort()
      }

      setIsLoading(true)
      const controller = new AbortController()
      searchController.current = controller

      const currentCoordinates = map.getCenter().toArray()

      searchByName(query, currentCoordinates[1], currentCoordinates[0], controller.signal)
        .then((value) => {
          setResults(value?.features?.slice(0, 5) || [])
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Search failed:', error)
          }
        })
        .finally(() => {
          setIsLoading(false)
          if (controller === searchController.current) {
            searchController.current = null
          }
        })
    }, 300),
    []
  )

  // Trigger search on query change
  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      setSelectedIndex(-1)
      return
    }
    debouncedSearch(query)
  }, [query, debouncedSearch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchController.current) {
        searchController.current.abort()
      }
    }
  }, [])

  // Render - SEULEMENT la partie recherche
  return html`
    <div id="search-container" className=${results.length > 0 ? 'search-container--with-results' : ''}>
      <div className="search-container__top">
        <label className="search-label">
          <img 
            src="./static/images/helium/search.svg" 
            className="search-label__icon"
            onClick=${() => query && debouncedSearch(query)}
          />
          <input 
            type="search" 
            id="search-input"
            placeholder="search..." 
            className="search-label__input"
            value=${query}
            onInput=${handleInput}
            onKeyDown=${handleKeyDown}
          />
        </label>
        <!-- places et layer-switcher seront ajoutés par index.html -->
      </div>
      <div id="search-results">
        ${results.map((result, index) => html`
          <div 
            className="search-results__result"
            selected=${index === selectedIndex ? 'true' : undefined}
            onClick=${() => handleResultClick(result)}
          >
            ${result.properties.label}
          </div>
        `)}
      </div>
      ${results.length > 0 && html`
        <div className="search-container__bottom">
          <button id="search-close-button" onClick=${handleClose}>Fermer la recherche</button>
        </div>
      `}
    </div>
  `
}
