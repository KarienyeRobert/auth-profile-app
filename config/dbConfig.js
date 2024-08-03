import mongoose from "mongoose";

const connectDb = async () =>{
    try {
        const uri = process.env.MONGO_URI; //add your URI in .env file
        if(!uri){
            throw new Error("Mongo URI is missing");
    
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDb;