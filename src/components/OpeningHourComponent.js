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
    const oh = new opening_hours(this._oh, null);
    const isOpen = oh.getState()
    if(isOpen) {
      this.querySelector('.opening-hour').removeAttribute('closed')
      this.querySelector('.opening-hour').setAttribute('open', 'true')
    } else {
      this.querySelector('.opening-hour').removeAttribute('open')
      this.querySelector('.opening-hour').setAttribute('closed','true')
    }

    // next week opening hour
    const now = new Date();
    const start = new Date(now);
    start.setHours(0,0,0,0);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const from = new Date(start);
      from.setDate(start.getDate() + i);
      const to = new Date(from);
      to.setHours(23,59,59,999);
      week.push({
        day: from.getDay(),
        intervals: oh.getOpenIntervals(from, to),
      });
    }

    console.log(week)
    
  }
}

customElements.define('c-opening-hour', OpeningHourComponent)

export default OpeningHourComponent
