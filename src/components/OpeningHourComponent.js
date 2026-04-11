function compute_opening_hours_obj (oh_string) {
  try {
    const oh = new opening_hours(oh_string, null)
    return oh
  } catch (error) {
    return null
  }
}

function formatOhInterval (interval) {
  const htmlInterval = document.createElement('span')
  const options = {
    hour: 'numeric',
    minute: 'numeric'
  }
  const start = new Intl.DateTimeFormat(undefined, options).format(interval[0])
  const end = new Intl.DateTimeFormat(undefined, options).format(interval[1])
  htmlInterval.innerText = `${start} – ${end}`
  return htmlInterval
}

class OpeningHourComponent extends HTMLElement {
  constructor () {
    super()
    const tpl = document.getElementById('template-opening-hour').content.cloneNode(true)
    this.appendChild(tpl)
  }

  set oh (oh) {
    this._oh = oh
    this.render()
  }

  get oh () {
    return this._oh
  }

  render () {
    const compute_oh = compute_opening_hours_obj(this.oh)
    if (!compute_oh) return
    const isOpen = compute_oh.getState()
    if (isOpen) {
      this.querySelector('.opening-hour').removeAttribute('closed')
      this.querySelector('.opening-hour').setAttribute('open', 'true')
    } else {
      this.querySelector('.opening-hour').removeAttribute('open')
      this.querySelector('.opening-hour').setAttribute('closed', 'true')
    }

    // next week opening hour
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)

    const week = []
    for (let i = 0; i < 7; i++) {
      const from = new Date(start)
      from.setDate(start.getDate() + i)
      const to = new Date(from)
      to.setHours(23, 59, 59, 999)
      week.push({
        day: from.getDay(),
        from,
        to,
        intervals: compute_oh.getOpenIntervals(from, to)
      })
    }

    for (const { from, intervals } of week) {
      const tpl = document.getElementById('template-opening-hour-day').content.cloneNode(true)
      tpl.querySelector('h2').innerText = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(from)
      if (intervals.length > 0) {
        intervals.forEach(element => {
          tpl.querySelector('.opening-hour__time').appendChild(formatOhInterval(element))
        })
      } else {
        tpl.querySelector('.opening-hour__time').innerText = 'Fermée'
      }
      this.querySelector('.opening-hour').appendChild(tpl)
    }
  }
}

customElements.define('c-opening-hour', OpeningHourComponent)

export default OpeningHourComponent
