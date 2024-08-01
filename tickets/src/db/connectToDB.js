import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Tickets service Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to Ticket service MongoDB", error);
    }
};

export { connectToDB };
