import mongoose from 'mongoose';
import { env } from '../env';

export const connectDB = async () => {
    try {
        if (!env.MONGO_URL) {
            throw new Error('MONGO_URL is not defined in environment variables');
        }
        await mongoose.connect(env.MONGO_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
