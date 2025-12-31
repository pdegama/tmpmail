import { Hono } from "hono";
import mailbox from "./mailbox";

const apiRouter = new Hono()

apiRouter.route("/mailbox", mailbox)

export default apiRouter