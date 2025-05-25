import { connect } from 'mongoose';

async function connectDB(uri) {
    try {
        await connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectDB;