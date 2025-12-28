import { Hono } from "hono";
import { Context } from "hono";

const auth = new Hono()

// that will give you tmp email address, and init mails
// but you must need to add token in auth header if you 
// dont pass then it return new token and tmp email 
auth.post("/", async (c: Context) => {
    return c.json({
        auth: "yesss"
    })
})

export default auth