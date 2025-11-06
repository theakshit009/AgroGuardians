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
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Database connection timeout"));
            }, 10000);
            
            mongoose.connection.once('connected', () => {
                clearTimeout(timeout);
                resolve(cachedConnection);
            });
            
            mongoose.connection.once('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }

    try {
        // Validate MONGODB_URI exists
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }

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
            
            mongoose.connection.on("disconnected", () => {
                console.log("DB disconnected");
                cachedConnection = null;
            });
        }

        // Connect to database with options for serverless
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/Agro-Guardians`, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        });
        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error("DB connection failed:", error.message);
        cachedConnection = null;
        // Don't throw in serverless - let the request handler deal with it
        if (process.env.VERCEL === "1") {
            console.error("Database connection failed in serverless environment");
        }
        throw error;
    }
};

export default connectDB;