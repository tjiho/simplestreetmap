class webSocketClient {
    constructor(mapId = null) {
        this.mapId = mapId;
        console.log("Init websocket client");
        this.socket = null;
        this.socket = new WebSocket("ws://localhost:8765");
        this.socket.onopen = this.init.bind(this);

        this.socket.onmessage = function (event) {
            console.log("Received message from websocket");
            console.log(event.data);
        };

        this.socket.onclose = function () {
            console.log("Disconnected from websocket");
        };
    }

    init() {
        console.log("Connected to websocket");

        if(this.mapId){
            this.send({action: "hello", mapId: this.mapId})
        } else {
            this.send({action: "hello"})
        }
    }

    send(message) {
        this.socket.send(JSON.stringify(message));
    }

    close() {
        this.socket.close();
    }

    onMessage(callback) {
        this.socket.onmessage = function (event) {
            callback(event.data);
        };
    }

    onOpen(callback) {
        this.socket.onopen = function () {
            callback();
        };
    }


}

const websocketClient = new webSocketClient()
export default websocketClient