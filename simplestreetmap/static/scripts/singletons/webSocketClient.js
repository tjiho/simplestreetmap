import Place from '../models/Place.js'
import annotationStore from './annotationsStore.js'
import eventBus from './eventBus.js'

class WebSocketClient {
  constructor () {
    this.userId = null
    this.socket = null
    this.mapToken = null
    this.writeToken = null
    this.readToken = null
    this.canEdit = false
    this.connecting = true
    this.isConnected = false
  }

  init (mapToken = null) {
    console.log('Init websocket client')
    this.mapToken = mapToken
    this.socket = new WebSocket(WEBSOCKET_URL)
    this.socket.onopen = this.onOpen.bind(this)
    this.socket.onmessage = this.onMessage.bind(this)
    this.socket.onclose = this.onclose.bind(this)
    // setInterval(() => {
    //   if (this.socket.readyState === WebSocket.CLOSED) {
    //     console.log('Websocket is closed')
    //     this.init()
    //   }

    //   this.send({ action: 'ping' })
    // }, 5000)
  }

  get isLocal () {
    return !this.connecting && !this.isConnected
  }

  onclose () {
    console.log('Disconnected from websocket')
    this.connecting = false
    this.isConnected = false
    eventBus.emit('websocket-disconnected')

    eventBus.emit('websocket-update-state')
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
    this.canEdit = data.write
    this.readToken = data.read_token
    this.writeToken = this.canEdit ? data.write_token : null
    this.mapToken = data.map_token
    this.connecting = false
    this.isConnected = true

    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('token', this.mapToken)
    history.replaceState(null, null, `${document.location.pathname}?${searchParams}`)

    if (data?.places) {
      data.places.forEach(placeData => {
        const place = new Place(placeData, 'init')
        place.serverId = placeData.uuid
        annotationStore.addSyncAnnotation(place)
      })
    }

    eventBus.emit('websocket-hello', data)
    eventBus.emit('websocket-update-state')
  }
}

const webSocketClient = new WebSocketClient()

export default webSocketClient
