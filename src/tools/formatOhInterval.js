const options = {
  hour: 'numeric',
  minute: 'numeric'
}

export function formatOhInterval (interval) {
  const start = new Intl.DateTimeFormat(undefined, options).format(interval[0])
  const end = new Intl.DateTimeFormat(undefined, options).format(interval[1])
  return `${start} – ${end}`
}
