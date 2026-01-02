import { Hono } from "hono";
import mailbox from "./mailbox";
import list from "./list";
import ws from "./ws";
import mail from "./mail"

const apiRouter = new Hono()

apiRouter.route("/mailbox", mailbox)
apiRouter.route("/list", list)
apiRouter.route("/mail", mail)
apiRouter.route("/ws", ws)

export default apiRouter