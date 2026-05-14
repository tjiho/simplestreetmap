/**
 * API unifiée pour toutes les recherches
 * Fonctions plates qui font juste du fetch
 */

/**
 * Recherche par nom (lieu, adresse, POI)
 * @param {string} query - Terme de recherche
 * @param {number} lat - Latitude du centre de recherche
 * @param {number} lng - Longitude du centre de recherche
 * @param {AbortSignal} signal - Signal pour annuler la requête
 * @returns {Promise<Object>} - Géojson avec features
 */
export function searchByName(query, lat, lng, signal) {
  return window.fetch(BASE_SEARCH_URL(query, lat, lng), { signal })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }
      return response.json()
    })
}

/**
 * Recherche inverse (coordonnées → nom)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {AbortSignal} signal - Signal pour annuler la requête
 * @returns {Promise<Object>} - Géojson avec features
 */
export function searchByCoords(lat, lng, signal) {
  return window.fetch(BASE_REVERSE_URL(lat, lng), { signal })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Reverse search failed: ${response.status}`)
      }
      return response.json()
    })
}

/**
 * Recherche Overpass (ID OSM → détails)
 * @param {string|number} id - ID OSM (node/way/relation)
 * @param {AbortSignal} signal - Signal pour annuler la requête
 * @returns {Promise<Object>} - Données OSM de l'élément
 */
export function searchById(id, signal) {
  const query = `[out:json][timeout:10];nwr(${id});out tags center;`
  return window.fetch(`${BASE_OVERPASS_URL}?data=${encodeURIComponent(query)}`, { signal })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Overpass search failed: ${response.status}`)
      }
      return response.json()
    })
    .then(data => data.elements && data.elements[0] ? data.elements[0] : null)
}
