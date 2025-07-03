export default function reverseSearch (lat, lng, callback) {
  window.fetch(BASE_REVERSE_URL(lat, lng)).then((response) => {
    response.json().then(callback)
  })
}
