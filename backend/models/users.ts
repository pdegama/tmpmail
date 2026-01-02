import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    mailbox: {
        type: String,
        unique: true,
    },
    expiredTime: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        index: { expires: 0 }
    },
});

export const Users = mongoose.model('Users', userSchema);
export type UserType = mongoose.InferSchemaType<typeof userSchema> & { _id: object }

