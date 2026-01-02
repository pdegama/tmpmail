import { Hono } from "hono";
import { verifyAndGetUser } from "../utils/mailbox";
import mongoose from "mongoose";
import { readMail, unreadMail, deleteMail } from "../utils/mail";

const mail = new Hono()

mail.patch("/read/:id", async (c) => {
    const id = c.req.param("id")
    if (mongoose.Types.ObjectId.isValid(id) === false) return c.json({ message: "Invalid mail id" }, 400)
    try {
        const user = await verifyAndGetUser(c)
        await readMail(user, id)
        return c.json({ message: "Mail read successfully" })
    } catch (err) {
        return c.json({ message: err }, 500)
    }
})

mail.patch("/unread/:id", async (c) => {
    const id = c.req.param("id")
    if (mongoose.Types.ObjectId.isValid(id) === false) return c.json({ message: "Invalid mail id" }, 400)
    try {
        const user = await verifyAndGetUser(c)
        await unreadMail(user, id)
        return c.json({ message: "Mail unread successfully" })
    } catch (err) {
        return c.json({ message: err }, 500)
    }
})

mail.delete("/delete/:id", async (c) => {
    const id = c.req.param("id")
    if (mongoose.Types.ObjectId.isValid(id) === false) return c.json({ message: "Invalid mail id" }, 400)
    try {
        const user = await verifyAndGetUser(c)
        await deleteMail(user, id)
        return c.json({ message: "Mail deleted successfully" })
    } catch (err) {
        return c.json({ message: err }, 500)
    }
})

export default mail