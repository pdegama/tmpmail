import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { WSContext } from "hono/ws";

const ws = new Hono()

const wsSockets = new Map<string, WSContext>()

ws.get("/", upgradeWebSocket(c => {
    return {
        onOpen(event, ws) {
            console.log('Connection opened')
            wsSockets.set("1", ws)
        },
        onMessage(event, ws) {
            console.log(`Message from client: ${event.data}`)
            wsSockets.set("1", ws)
        },
        onClose: () => {
            console.log('Connection closed')
        },
    }
}))

setInterval(() => {
    wsSockets.get("1")?.send('Hello from server!')
}, 3000)

export default ws