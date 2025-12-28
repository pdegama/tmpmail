import mongoose from 'mongoose';

const dummySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Dummy = mongoose.model('Dummy', dummySchema);
