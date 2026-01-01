import { Hono } from "hono";
import mailbox from "./mailbox";
import list from "./list";
import ws from "./ws";

const apiRouter = new Hono()

apiRouter.route("/mailbox", mailbox)
apiRouter.route("/list", list)
apiRouter.route("/ws", ws)

export default apiRouter