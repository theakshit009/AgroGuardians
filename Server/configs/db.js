import mongoose from "mongoose";

// Cache the connection to reuse in serverless environments
let cachedConnection = null;

const connectDB = async () => {
    // If we already have a cached connection and it's ready, return it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    // If connection is in progress, wait for it
    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve) => {
            mongoose.connection.once('connected', () => {
                resolve(cachedConnection);
            });
        });
    }

    try {
        // Set up event listeners (only once)
        if (!cachedConnection) {
            mongoose.connection.on("connected", () => {
                console.log("DB connected");
                cachedConnection = mongoose.connection;
            });
            
            mongoose.connection.on("error", (err) => {
                console.error("DB connection error:", err.message);
                cachedConnection = null;
            });
        }

        // Connect to database
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/Agro-Guardians`);
        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error("DB connection failed:", error.message);
        throw error;
    }
};

export default connectDB;