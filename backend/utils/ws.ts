import { WSContext } from "hono/ws";
import { verifyAndGetUserWS } from "./mailbox";
import { MailType } from "../models/mails";

const wsSockets = new Map<string, WSContext>()

export async function authUserWS(ws: WSContext, token: string) {
    try {
        const user = await verifyAndGetUserWS(token)
        // console.log(user);

        const userId = user._id.toString()
        wsSockets.set(userId, ws)

        // @ts-ignore
        ws.raw.onClose = () => {
            console.log(`User ${userId} disconnected`);
            wsSockets.delete(userId)
        }

        console.log(`User ${userId} connected`);
    } catch (err) {
        // console.log(err);
    }
}

export async function sendMailToWs(mail: MailType) {
    // console.log(mail);
    const socket = wsSockets.get(mail.userId.toString())
    // console.log(socket);

    if (socket) {
        socket.send(JSON.stringify({
            event: "mail",
            data: mail
        }))
    }
}