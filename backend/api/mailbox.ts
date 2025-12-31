import { Hono } from "hono";
import { Context } from "hono";
import { changeMailbox, createNewMailboxAddress, decodeUserToken, encodeUserToken, getMailBoxUser, mailboxExist, validMailbox, verifyUser } from "../utils/mailbox";
import { env } from "../env";

const mailbox = new Hono()

mailbox.get("/", async (c: Context) => {
    const mailboxUser = await getMailBoxUser(c)
    const availableDomain = env.MAILBOX_DOMAINS
    return c.json({
        user: mailboxUser,
        availableDomain: availableDomain,
    })
})

mailbox.patch("/change", async (c: Context) => {
    const newMailBoxUser = (await c.req.json()).mailbox;
    if (!newMailBoxUser) return c.json({
        message: "Invalid request, mailbox require",
    }, 400)

    try {
        const userToken = await verifyUser(c)
        const isValidMailbox = validMailbox(newMailBoxUser)
        const newMailboxExist = await mailboxExist(isValidMailbox)
        if (newMailboxExist) return c.json({
            message: "Mailbox already exist",
        }, 400)
        await changeMailbox(userToken, isValidMailbox)

        const newToken = encodeUserToken({
            mailbox: isValidMailbox,
        })

        return c.json({
            message: "Mailbox changed successfully",
            mailbox: isValidMailbox,
            token: newToken,
        })
    } catch (err: any) {
        return c.json({
            message: err,
        }, 400)
    }
})

mailbox.patch("/shuffle", async (c: Context) => {
    try {
        const userToken = await verifyUser(c)
        const newMailBoxUser = await createNewMailboxAddress()
        await changeMailbox(userToken, newMailBoxUser)

        const newToken = encodeUserToken({
            mailbox: newMailBoxUser,
        })

        return c.json({
            message: "Mailbox shuffled successfully",
            mailbox: newMailBoxUser,
            token: newToken,
        })
    } catch (err: any) {
        return c.json({
            message: err,
        }, 400)
    }
})

export default mailbox