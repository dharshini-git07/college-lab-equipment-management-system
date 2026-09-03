const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const databaseConnection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected successfully: ${databaseConnection.connection.host}`);
    } catch (connectionError) {
        console.error(`MongoDB connection error: ${connectionError.message}`);
        process.exit(1);
    }
};

module.exports = connectDatabase;
