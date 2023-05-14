import asyncio
import websockets
import json
import sys
import logging

from sqlalchemy import create_engine

from controller import Controller
from model import setup_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("websocket")
logger.setLevel(logging.DEBUG)

engine = create_engine("sqlite:///database.sqlite", echo=False)


class WebsocketHandler():
    def __init__(self):
        self.userController = Controller(engine)
        
    
    async def websocketListener(self, websocket):
        logger.debug("New connection")
        
        async for message in websocket:
            message = json.loads(message)
            match message:
                case {"action": "ping"}:
                    logger.debug("Ping received")
                    await websocket.send("pong")
                case {"action": "pong"}:
                    logger.debug("Pong received")
                    await websocket.send("ping")
                case {"action": "close"}:
                    logger.debug("Close received")
                    await websocket.close()
                case {"action": "hello"}:
                    logger.debug("Hello received")
                    await self.hello(message, websocket)
                    # if token, check if data else create empty session
                    # if no token, create empty session and send token
                case {"action": "add_annotation"}:
                    logger.debug("add_annotation received")
                    await self.add_annotation(message, websocket)
                    # create new annotation
                case {"action": "remove_annotation"}:
                    logger.debug("remove_annotation received")
                    await self.remove_annotation(message, websocket)
                    # check id and delete annotation

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

    async def add_annotation(self, message, websocket):
        if("annotation" in message):
            saved_annotation = self.userController.add_annotation(message["annotation"])
            await websocket.send(json.dumps({
                "action": "add", 
                "annotation": message["annotation"], 
                "uuid": saved_annotation.uuid, 
            }))
        else:
            logger.warning("No annotation in message")
        pass

    async def remove_annotation(self, message, websocket):
        pass


async def main():
    if len(sys.argv) > 1 and sys.argv[1] == "setup":
        setup_database(engine)
        print("Database created")
        return

    wsHandler = WebsocketHandler()
    async with websockets.serve(wsHandler.websocketListener, "localhost", 8765):
        logger.debug("Server started")
        await asyncio.Future()  # run forever

asyncio.run(main())