import { Hono } from "hono";
import { env } from "../env";

import mailbox from "./mailbox";
import list from "./list";
import ws from "./ws";
import mail from "./mail"
import dummymail from "./dummymail";

const apiRouter = new Hono()

apiRouter.route("/mailbox", mailbox)
apiRouter.route("/list", list)
apiRouter.route("/mail", mail)
apiRouter.route("/ws", ws)
if (env.TYPE != "production") apiRouter.route("/dummymail", dummymail)

export default apiRouter