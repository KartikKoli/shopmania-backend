import mongoose from "mongoose";

const connectToDb=async (MONGO_URI)=>{
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Successfully connected to MongoDb`);
    } catch (error) {
        console.log("Error connecting to MongoDb"+error);
        process.exit(1);
    }
}

export default connectToDb;