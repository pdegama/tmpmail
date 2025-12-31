import amqplib from 'amqplib';
import { env } from '../env';

let conn: amqplib.ChannelModel;

export const connectAmpq = async (): Promise<amqplib.ChannelModel> => {
    if (conn) return conn;
    try {
        conn = await amqplib.connect(`amqp://${env.RABBITMQ_USER}:${env.RABBITMQ_PASS}@${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`);
        return conn;
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
