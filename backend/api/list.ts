import { Hono } from "hono"
import { verifyUser } from "../utils/mailbox"
import { Users } from "../models/users"
import mongoose from "mongoose"
import { Mails } from "../models/mails"

const list = new Hono()

list.get("/", async (c) => {
    try {
        const userToken = await verifyUser(c)
        const user = await Users.findOne({
            mailbox: userToken.mailbox,
        })
        const limit = parseInt(c.req.query("limit") || "10")
        const after = c.req.query("after") || null
        
        if (after && mongoose.Types.ObjectId.isValid(after) === false) {
            return c.json({
                message: "Invalid 'after' parameter, we must need a valid ObjectId",
            }, 400)
        }

        let totalEmails = undefined
        if (after == null) {   
            totalEmails = await Mails.countDocuments({
                userId: user?._id,
            })
        }

        const mails = await Mails.find({
            userId: user?._id,
            ...(after ? { _id: { $lt: new mongoose.Types.ObjectId(after) } } : {}),
        })
        .sort({ _id: -1 })
        .limit(limit)

        const isLast = mails.length < limit 

        return c.json({
            emails: mails,
            totalEmails: totalEmails,
            isLast,
        })
    } catch (err)   {        
        return c.json({
            message: err,
        }, 500)
    }
})
    
export default list
