import { Hono } from "hono";
import { addDummyMail } from "../queue/adddummy";
import { validMailbox } from "../utils/mailbox";

const dummymail = new Hono()

dummymail.post("/:to", async (c) => {
    try {
        const to = c.req.param("to");
        const absTo = validMailbox(to)
        await addDummyMail(absTo);
        return c.json({ message: "Dummy mail added" }, 200)
    } catch (err) {
        return c.json({ message: err }, 500)
    }
})

export default dummymail