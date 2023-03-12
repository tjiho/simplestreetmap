import asyncio
import websockets

async def echo(websocket):
    print("New connection")
    async for message in websocket:
        print(message)
        #await websocket.send(message)

async def main():
    async with websockets.serve(echo, "localhost", 8765):
        print("Server started")
        await asyncio.Future()  # run forever

asyncio.run(main())