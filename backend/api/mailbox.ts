import { Hono } from "hono";
import { Context } from "hono";
import { getMailBoxUser } from "../utils/mailbox";
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

export default mailbox