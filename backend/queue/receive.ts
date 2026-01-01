import { YAML } from "bun";
import { env } from "../env";
import { connectAmpq } from "./ampq";
import { simpleParser } from 'mailparser';
import { Users } from "../models/users";
import { Mails } from "../models/mails";

export const reciveEmail = async () => {
    console.log("start recive email");

    const connection = await connectAmpq();
    const channel = await connection.createChannel();
    await channel.assertQueue(env.RABBITMQ_QUEUE || "recive_mail", { durable: false });

    channel.prefetch(1);
    channel.consume(env.RABBITMQ_QUEUE || "recive_mail", async (msg) => {
        if (msg !== null) {
            // console.log(msg.content.toString());
            const status = await fwdMail(msg.content.toString());
            if (status) {
                channel.ack(msg);
            }

            // channel.ack(msg);
        } else {
            console.log('Consumer cancelled by server');
        }
    });
}

export type FullMail = {
    time: string,
    success: boolean,
    ptr_ip: any,
    from: string,
    recipients: string[],
    data: string,
}

const fwdMail = async (msg: string) => {
    const fullMail = YAML.parse(msg) as FullMail;
    if (!fullMail.success) return true;

    try {
        const mail = await simpleParser(fullMail.data);
        const data = {
            time: mail.date || new Date(fullMail.time),
            subject: mail.subject,
            from: mail.from?.value[0],
            to: Array.isArray(mail.to) ? mail.to?.map(m => m.value) : [mail.to?.value].flat(),
            replyBy: mail.replyTo?.value[0],
            messageId: mail.messageId,
            text: mail.text,
            html: mail.html || "",
            attachments: mail.attachments.map(att => ({
                filename: att.filename,
                contentType: att.contentType,
                size: att.size,
            })),
        }

        for (const recipient of fullMail.recipients) {
            const user = await Users.findOne({ mailbox: recipient.toLowerCase().trim() });
            if (user) {
                await Mails.create({ ...data, userId: user._id });
                console.log(`Mail for ${recipient} stored.`);
            }
        }
        return true;
    } catch (err) {
        console.log(err);
        return true;
    }
}
