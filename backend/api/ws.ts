import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";
import { authUserWS } from "../utils/ws";

const ws = new Hono()

ws.get("/", upgradeWebSocket(c => {
    return {
        onMessage(event, ws) {
            try {
                const data = JSON.parse(event.data.toString())
                if (data.event && typeof data.event === "string") {
                    switch (data.event) {
                        case "auth":
                            // console.log("11");
                            if (data.token && typeof data.token === "string") authUserWS(ws, data.token)
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                // console.log(error);
            }
        },
        onClose: (_, ws) => {
            // @ts-ignore
            ws.raw.onClose && ws.raw.onClose()
        },
    }
}))

export default ws