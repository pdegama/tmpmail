import { Hono } from "hono";
import auth from "./auth";

const apiRouter = new Hono()

apiRouter.route("/auth", auth)

export default apiRouter