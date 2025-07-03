export default function parseHashCoordinates (hash, defaultLng, defaultLat, defaultZoom) {
  const coordinates = hash.replace('#map=', '').split('/')

  return {
    lng: coordinates?.[2] || defaultLng,
    lat: coordinates?.[1] || defaultLat,
    zoom: coordinates?.[0] || defaultZoom
  }
}
