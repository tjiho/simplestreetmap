import Place from '../models/Place.js'
import annotationStore from './annotationsStore.js'

class WebSocketClient {
  constructor () {
    this.userId = null
    this.socket = null
    this.mapToken = null
  }

  init (mapToken = null) {
    console.log('Init websocket client')
    this.mapToken = mapToken
    this.socket = new WebSocket(WEBSOCKET_URL)
    this.socket.onopen = this.onOpen.bind(this)
    this.socket.onmessage = this.onMessage.bind(this)
    this.socket.onclose = function () {
      console.log('Disconnected from websocket')
    }
    // setInterval(() => {
    //   if (this.socket.readyState === WebSocket.CLOSED) {
    //     console.log('Websocket is closed')
    //     this.init()
    //   }

    //   this.send({ action: 'ping' })
    // }, 5000)
  }

  onOpen () {
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
    console.log('Received message from websocket:')
    const data = JSON.parse(event.data)
    console.log(data)
    const action = data.action
    switch (action) {
      case 'hello':
        this.hello(data)
        break
      case 'add_annotation':
        this.addAnnotation(data)
        break
      case 'remove_annotation':
        this.removeAnnotation(data)
        break
      default:
        break
    }
  }

  addAnnotation (data) {
    const serverId = data.uuid
    const localId = data.annotation.id
    const userId = data.user_id
    if (userId === this.userId) {
      annotationStore.moveLocalAnnotationToSync(localId, serverId)
    } else {
      const place = new Place(data.annotation, userId, serverId)
      annotationStore.addSyncAnnotation(place)
    }
  }

  removeAnnotation (data) {
    const serverId = data.uuid
    const userId = data.user_id
    if (userId === this.userId) {
      return
    }
    annotationStore.removeSyncAnnotation(serverId, { sendToServer: false })
  }

  hello (data) {
    console.log('hello from websocket')
    this.userId = data.user_id
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('token', data.map_token)
    history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)

    if (data?.places) {
      data.places.forEach(placeData => {
        const place = new Place(placeData, 'init')
        place.serverId = placeData.uuid
        annotationStore.addSyncAnnotation(place)
      })
    }
  }
}

const webSocketClient = new WebSocketClient()

export default webSocketClient
