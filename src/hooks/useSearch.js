import { useState, useEffect, useRef, useCallback } from '../libs/preact.mjs'
import debounce from '../tools/debounce.js'
import { searchByName } from '../api/search.js'
import { map } from '../createMap.js'
import places from '../singletons/places.js'

export default function useSearch () {
  const [query, setQueryState] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  const searchController = useRef(null)

  const setQuery = useCallback((value) => {
    setQueryState(value)
    setSelectedIndex(-1)
  }, [])

  const clear = useCallback(() => {
    setQueryState('')
    setResults([])
    setSelectedIndex(-1)
  }, [])

  const selectResult = useCallback((result) => {
    places.add(
      result.geometry.coordinates[1],
      result.geometry.coordinates[0],
      result?.properties?.label
    )
    map.flyTo({ center: result.geometry.coordinates, zoom: 13 })
    clear()
  }, [clear])

  const submit = useCallback(() => {
    if (results.length === 0) return
    const result = selectedIndex >= 0 ? results[selectedIndex] : results[0]
    selectResult(result)
  }, [results, selectedIndex, selectResult])

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
      case 27: // Escape
        clear()
        break
    }
  }, [results, selectedIndex, selectResult, clear])

  const debouncedSearch = useCallback(
    debounce((q) => {
      if (q && q[0] === '#') {
        const coordinates = q.slice(1).split(',')
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

      if (searchController.current) {
        searchController.current.abort()
      }

      setIsLoading(true)
      const controller = new AbortController()
      searchController.current = controller

      const currentCoordinates = map.getCenter().toArray()

      searchByName(q, currentCoordinates[1], currentCoordinates[0], controller.signal)
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

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      setSelectedIndex(-1)
      return
    }
    debouncedSearch(query)
  }, [query, debouncedSearch])

  useEffect(() => {
    return () => {
      if (searchController.current) {
        searchController.current.abort()
      }
    }
  }, [])

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    isLoading,
    selectResult,
    submit,
    clear,
    handleKeyDown,
    runSearch: debouncedSearch
  }
}
