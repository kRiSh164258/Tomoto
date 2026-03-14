import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // ← Add this
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Zomato_clone",
        });
        console.log("Connected DB"); // ← Not printing = connectDB never called
    }
    catch (error) {
        console.log(error);
    }
};
export default connectDB;
