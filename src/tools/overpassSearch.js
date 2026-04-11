export default function overpassSearch (id, signal) {
  const query = `[out:json][timeout:10];nwr(${id});out tags center;`

  return window.fetch(`${BASE_OVERPASS_URL}?data=${encodeURIComponent(query)}`, { signal })
    .then(response => response.json())
    .then(data => data.elements && data.elements[0] ? data.elements[0] : null)
}
