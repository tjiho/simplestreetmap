class WebSocketClient {
  constructor (mapToken = null) {
    this.mapToken = mapToken
    console.log('Init websocket client')
    this.socket = null
    this.socket = new WebSocket('ws://localhost:8765')
    this.socket.onopen = this.init.bind(this)

    this.socket.onmessage = function (event) {
      console.log('Received message from websocket')
      console.log(event.data)
    }

    this.socket.onclose = function () {
      console.log('Disconnected from websocket')
    }
  }

  init () {
    console.log('Connected to websocket')

    if (this.mapToken) {
      this.send({ action: 'hello', map_token: this.mapToken })
    } else {
      this.send({ action: 'hello' })
    }

    //this.onMessage('hello',this.#helloCallback.bind(this))
  }

  send (message) {
    this.socket.send(JSON.stringify(message))
  }

  close () {
    this.socket.close()
  }

  onMessage (actionToFilterOn, callback) {
    this.socket.onmessage = function (event) {
      const data = JSON.parse(event.data)
      console.log(data)
      if (data.action === actionToFilterOn) {
        callback(data)
      }
    }
  }

  onOpen (callback) {
    this.socket.onopen = function () {
      callback()
    }
  }
}

export default WebSocketClient
