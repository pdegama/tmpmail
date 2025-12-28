import { Context, Hono } from 'hono'
import { env } from './env'
import { connectDB } from './db/connect'
import apiRouter from './api/router'
import { cors } from "hono/cors"

await connectDB();

const app = new Hono()
app.use(cors())

app.get('/', (c) => {
  return c.json({
    message: 'this is tmp mail api server, you can also use API direclty',
    type: env.TYPE,
  })
})

app.route("/api", apiRouter);

app.notFound((ctx: Context) => ctx.json({
  message: "Not Found",
}, 404))

export default app
