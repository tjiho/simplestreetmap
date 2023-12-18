class WebSocketClient {
  constructor (mapToken = null) {
    this.mapToken = mapToken
    console.log('Init websocket client')
    this.socket = null
    this.socket = new WebSocket('ws://localhost:8765')
    this.socket.onopen = this.init.bind(this)

    const onMessageCallBack = (event) => {
      console.log('Received message from websocket')
      const data = JSON.parse(event.data)
      console.log(data)
      const action = data.action
      this.callCallbacks(action, data)
    }

    this.socket.onmessage = onMessageCallBack.bind(this)

    this.socket.onclose = function () {
      console.log('Disconnected from websocket')
    }

    this.callbacks = { add: [], hello: [], remove: [] } //
  }

  init () {
    console.log('Connected to websocket')

    if (this.mapToken) {
      this.send({ action: 'hello', map_token: this.mapToken })
    } else {
      this.send({ action: 'hello' })
    }

    // this.onMessage('hello',this.#helloCallback.bind(this))
  }

  send (message) {
    this.socket.send(JSON.stringify(message))
  }

  close () {
    this.socket.close()
  }

  onMessage (actionToFilterOn, callback) {
    if (this.callbacks[actionToFilterOn]) { this.callbacks[actionToFilterOn].push(callback) } else { this.callbacks[actionToFilterOn] = [callback] }
  }

  callCallbacks (action, data) {
    if (this.callbacks[action]) {
      this.callbacks[action].forEach(callback => {
        callback(data)
      })
    }
  }

  onOpen (callback) {
    this.socket.onopen = function () {
      callback()
    }
  }
}

export default WebSocketClient
