class WebSocketClient {
  constructor () {
    
  }

  init (mapToken = null) {
    console.log('Init websocket client')
    this.mapToken = mapToken
    this.socket = null
    this.socket = new WebSocket('ws://localhost:8765')
    this.socket.onopen = this.onOpen.bind(this)
    this.socket.onmessage = this.onMessage.bind(this)
    this.socket.onclose = function () {
      console.log('Disconnected from websocket')
    }
  }

  onOpen() {
    console.log('Connected to websocket')
    if (this.mapToken) {
      this.send({ action: 'hello', map_token: this.mapToken })
    } else {
      this.send({ action: 'hello' })
    }
  }

  send (message) {
    this.socket.send(JSON.stringify(message))
  }

  close () {
    this.socket.close()
  }

  onMessage (event) {
    console.log('Received message from websocket')
    const data = JSON.parse(event.data)
    console.log(data)
    const action = data.action
    switch (action) {
      case 'add':
        
      break;
      case 'remove':

      break;
      default:
      break;
    }
  }

  add() {

  }

  remove() {

  }
}

const webSocketClient = new WebSocketClient()

export default webSocketClient
