import { Hono } from "hono"

const list = new Hono()

list.get("/", (c) => {
    return c.json({
        message: "list api",
    })
})

export default list
