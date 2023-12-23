export async function fetchSearchResult (query, signal) {
  const result = await window.fetch(`${BASE_API_URL}/search?q=${query}`, signal)
  return await result.json()
}

export async function fetchItinerary (from, to, mode, signal) {
  const result = await window.fetch(`${BASE_API_URL}/itinerary?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}&mode=${mode}`, signal)
  return await result.json()
}

export async function fetchReverseGeocoding (coordinates, signal) {
  const result = await window.fetch(`${BASE_API_URL}/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}`, signal)
  return await result.json()
}
