import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        // ✅ Corrected: Removed unnecessary await before assigning promise
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/animeSociety`, opts);
    }
    cached.conn = await cached.promise; // ✅ Awaiting the connection
    return cached.conn;
}
