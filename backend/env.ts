export const env = {
    TYPE: process.env.TYPE || 'idk',
    RABBITMQ_USER: process.env.RABBITMQ_USER,
    RABBITMQ_PASS: process.env.RABBITMQ_PASS,
    RABBITMQ_HOST: process.env.RABBITMQ_HOST,
    RABBITMQ_PORT: process.env.RABBITMQ_PORT,
    RABBITMQ_QUEUE: process.env.RABBITMQ_QUEUE,
    MONGO_URL: process.env.MONGO_URL,
    JWT: process.env.JWT,
    MAILBOX_DOMAINS: process.env.MAILBOX_DOMAINS?.split(";").map(e => e.trim().toLowerCase()).filter(e => e != "") as string[],
}