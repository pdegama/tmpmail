import { Hono } from "hono"
import { verifyAndGetUser, verifyUser } from "../utils/mailbox"
import mongoose from "mongoose"
import { getAfterId, getMails, getTotalMailCount } from "../utils/list"

const list = new Hono()

list.get("/", async (c) => {
    try {
        const user = await verifyAndGetUser(c)

        const limit = parseInt(c.req.query("limit") || "10")
        const after = c.req.query("after") || null
        if (after && mongoose.Types.ObjectId.isValid(after) === false) {
            return c.json({
                message: "Invalid 'after' parameter, we must need a valid ObjectId",
            }, 400)
        }

        let totalEmails = after == null ? await getTotalMailCount(user) : undefined

        let mails = await getMails(user, {
            after,
            limit,
        })
        let afterId = await getAfterId(mails)

        const isLast = mails.length < limit

        return c.json({
            emails: mails,
            totalEmails,
            isLast,
            afterId,
        })
    } catch (err) {
        return c.json({
            message: err,
        }, 500)
    }
})

export default list
