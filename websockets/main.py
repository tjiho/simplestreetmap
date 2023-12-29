import asyncio
import websockets
import json
import sys
import logging

from sqlalchemy import create_engine
from collections import defaultdict

from controller import Controller
from model import setup_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("websocket")
logger.setLevel(logging.DEBUG)

engine = create_engine("sqlite:///database.sqlite", echo=False)


class WebsocketHandler():
    def __init__(self):
        
        self.clients = defaultdict(set)
    
   
    async def websocketListener(self, websocket):
        logger.debug("New connection")
        
        async for message in websocket:
            #try:
            message = json.loads(message)
            print(message)
            match message:
                case {"action": "ping"}:
                    logger.debug("Ping received")
                    await websocket.send(json.dumps({"action": "pong"}))
                case {"action": "pong"}:
                    logger.debug("Pong received")
                    await websocket.send(json.dumps({"action": "ping"}))
                case {"action": "close"}:
                    logger.debug("Close received")
                    await websocket.close()
                case {"action": "hello"}:
                    logger.debug("Hello received")
                    await self.hello(message, websocket)
                case {"action": "add_annotation"}:
                    logger.debug("add_annotation received")
                    await self.add_annotation(message, websocket)
                case {"action": "remove_annotation"}:
                    logger.debug("remove_annotation received")
                    await self.remove_annotation(message, websocket)
            # except Exception as e:
            #     logger.error(e)
            #     #await websocket.send(json.dumps({"action": "error", "message": str(e)}))
            #     pass

    async def run_loop(self):
        while True:
            await asyncio.sleep(1)

    async def hello(self, message, websocket):
        websocket.userController = Controller(engine)
        if "map_token" in message:
            print("Loading plan")

            if "read" in message["map_token"]:
                try:
                    plan = websocket.userController.load_plan_by_read_token(message["map_token"])
                    await websocket.send(json.dumps({
                        "action": "hello", 
                        "map_token": plan.read_token, 
                        "places": [ place.toJSON() for place in plan.places],
                        "user_id": websocket.userController.user_id,
                        "write": False,
                        "read_token": plan.read_token
                    }))
                except Exception as e:
                    print(e)
                    # return error
                    pass
            else:
                try:
                    plan = websocket.userController.load_plan(message["map_token"])
                    await websocket.send(json.dumps({
                        "action": "hello", 
                        "map_token": plan.token, 
                        "places": [ place.toJSON() for place in plan.places],
                        "user_id": websocket.userController.user_id,
                        "write": True,
                        "read_token": plan.read_token
                    }))
                except Exception as e:
                    print(e)
                    # return error
                    pass
        else:
            print("Creating new plan")
            plan = websocket.userController.create_plan()
            await websocket.send(json.dumps({
                "action": "hello", 
                "map_token": plan.token, 
                "read_token": plan.read_token,
                "user_id": websocket.userController.user_id,
                "write": True,
            }))

        self.clients[plan.token].add(websocket)

    async def add_annotation(self, message, websocket):
        if not websocket.userController.can_edit:
            return

        if "annotation" in message:
            saved_annotation = websocket.userController.add_annotation(message["annotation"])
            
            if saved_annotation is None:
                return

            await self.send_messages_to_clients(websocket.userController.plan.token, json.dumps({
                "action": "add_annotation", 
                "annotation": message["annotation"], 
                "uuid": saved_annotation.uuid,
                "user_id": websocket.userController.user_id
            }))
        else:
            logger.warning("No annotation in message")
        pass

    async def remove_annotation(self, message, websocket):
        if not websocket.userController.can_edit:
            return

        if "id" in message and "object_type" in message:
            websocket.userController.remove_annotation(message['id'], message['object_type'])
            await self.send_messages_to_clients(websocket.userController.plan.token, json.dumps({
                "action": "remove_annotation", 
                "uuid": message["id"],
                "user_id": websocket.userController.user_id
            }))
        else:
            logger.warning("No ID in message")
        pass
    
    async def send_messages_to_clients(self, plan_token, message):
        for websocketClient in self.clients[plan_token].copy():
            try:
                await websocketClient.send(message)
            except Exception as e:
                self.clients[plan_token].remove(websocketClient)


async def main():
    if len(sys.argv) > 1 and sys.argv[1] == "setup":
        setup_database(engine)
        print("Database created")
        return

    wsHandler = WebsocketHandler()
    async with websockets.serve(wsHandler.websocketListener, "127.0.0.1", 8765):
        logger.debug("Server started")
        # await broadcast_messages()  # runs forever
        await asyncio.Future()  # run forever

asyncio.run(main())