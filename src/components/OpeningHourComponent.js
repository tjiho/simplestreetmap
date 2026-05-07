import { html } from '../libs/preact.mjs'
import { compute_opening_hours_obj } from '../tools/compute_opening_hours_obj.js'
import { formatOhInterval } from '../tools/formatOhInterval.js'

function OpeningHourDay ({ day, intervals }) {
  const dayName = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(day)
  
  return html`
    <div class="opening-hour__day">
      <h2>${dayName}</h2>
      <div class="opening-hour__time">
        ${intervals.length > 0
          ? intervals.map(interval => html`<span>${formatOhInterval(interval)}</span>`)
          : 'Fermée'
        }
      </div>
    </div>
  `
}

export default function OpeningHourComponent ({ oh }) {
  const computeOh = compute_opening_hours_obj(oh)
  
  if (!computeOh) return null
  
  const isOpen = computeOh.getState()
  const attrs = isOpen ? { open: 'true' } : { closed: 'true' }
  
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
      day: from,
      intervals: computeOh.getOpenIntervals(from, to)
    })
  }

  return html`
    <article class="opening-hour" ...${attrs}>
      <h1 class="opening-hour__title opening-hour__title--open">
        Ouvert
      </h1>
      <h1 class="opening-hour__title opening-hour__title--closed">
        Fermée
      </h1>
      <div class="opening-hour__description"></div>
      ${week.map(({ day, intervals }) =>
        html`<${OpeningHourDay} day=${day} intervals=${intervals} />`
      )}
    </article>
  `
}
