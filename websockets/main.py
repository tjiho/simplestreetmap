import asyncio
import websockets
import json
import sys
from sqlalchemy import create_engine

from controller import Controller
from model import setup_database

engine = create_engine("sqlite:///database.sqlite", echo=True)


class WebsocketHandler():
    def __init__(self, ):
        self.userController = Controller(engine)
        
    
    async def websocketListener(self, websocket):
        print("New connection")
        
        async for message in websocket:
            message = json.loads(message)
            match message:
                case {"action": "ping"}:
                    print("Ping received")
                    await websocket.send("pong")
                case {"action": "pong"}:
                    print("Pong received")
                    await websocket.send("ping")
                case {"action": "close"}:
                    print("Close received")
                    await websocket.close()
                case {"action": "hello"}:
                    print("Hello received")
                    await self.hello(message, websocket)
                    # if token, check if data else create empty session
                    # if no token, create empty session and send token
                case {"action": "create"}:
                    print("Create received")
                    await self.create(message, websocket)
                    # create new annotation
                case {"action": "delete"}:
                    print("Delete received")
                    await self.delete(message, websocket)
                    # check id and delete annotation

            print(message)
            #await websocket.send(message)

    async def hello(self, message, websocket):
        if "map_token" in message:
            print("Loading plan")
            try:
                plan = self.userController.load_plan(message["map_token"])
                print(plan)
                await websocket.send(json.dumps({"action": "hello", "map_token": plan.token}))
            except Exception as e:
                print(e)
                # return error
                pass
        else:
            print("Creating new plan")
            plan = self.userController.create_plan()
            await websocket.send(json.dumps({"action": "hello", "map_token": plan.token}))

    async def create(self, message, websocket):
        pass

    async def delete(self, message, websocket):
        pass


async def main():
    if len(sys.argv) > 1 and sys.argv[1] == 'setup':
        setup_database(engine)
        print('Database created')
        return

    wsHandler = WebsocketHandler()
    async with websockets.serve(wsHandler.websocketListener, "localhost", 8765):
        print("Server started")
        await asyncio.Future()  # run forever

asyncio.run(main())