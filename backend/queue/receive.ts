import { YAML } from "bun";
import { env } from "../env";
import { connectAmpq } from "./ampq";
import { simpleParser } from 'mailparser';

export const reciveEmail = async () => {
    const connection = await connectAmpq();
    const channel = await connection.createChannel();
    await channel.assertQueue(env.RABBITMQ_QUEUE || "recive_mail", { durable: false });

    channel.prefetch(1);
    channel.consume(env.RABBITMQ_QUEUE || "recive_mail", async (msg) => {
        if (msg !== null) {
            fwdMail(msg.content.toString());
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

    } catch (err) {
        return true;
    }
}
