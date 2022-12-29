export async function fetchSearchResult(query, signal) {
  const result = await window.fetch(`${BASE_API_URL}/search?q=${query}`, signal)
  return await result.json()
}

export async function fetchItinerary(from, to, signal) {
  const result = await window.fetch(`${BASE_API_URL}/itinerary?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}`, signal)
  return await result.json()
}
