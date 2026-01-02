import mongoose from 'mongoose';

const mailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    time: {
        type: Date,
        required: true,
        default: Date.now,
    },
    subject: {
        type: String,
    },
    from: {
        type: Object,
    },
    to: {
        type: Object,
    },
    replyBy: {
        type: Object,
    },
    messageId: {
        type: String,
    },
    text: {
        type: String,
    },
    html: {
        type: String,
    },
    attachments: {
        type: Array,
    },
    read: {
        type: Boolean,
        default: false,
    },
    expiredTime: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        index: { expires: 0 }
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

export const Mails = mongoose.model('Mails', mailSchema);
export type MailType = mongoose.InferSchemaType<typeof mailSchema> & { _id: object }
