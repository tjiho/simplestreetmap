export default function debounce (func, timeout = 300) {
  let timer
  return (...args) => {
    return new Promise((resolve, reject) => {
      clearTimeout(timer)
      timer = setTimeout(() => { func.apply(this, args).then(resolve).catch(reject) }, timeout)
    })
  }
}
