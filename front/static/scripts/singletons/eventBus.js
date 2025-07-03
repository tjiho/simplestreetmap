class EventBus {
  // inspired by https://css-tricks.com/lets-create-a-lightweight-native-event-bus-in-javascript/
  constructor () {
    this.eventTarget = document.appendChild(document.createComment('event-bus'))
  }

  on (eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback)
  }

  off (eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback)
  }

  emit (eventName, detail) {
    return this.eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }))
  }
}

const eventBus = new EventBus()
export default eventBus
