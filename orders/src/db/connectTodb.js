import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Order Service connected to MongoDB");
    } catch (error) {
        console.log("Error connecting mongo db", error);
    }
};

export { connectToDB };
