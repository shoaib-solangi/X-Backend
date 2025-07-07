import mongoose from "mongoose";
import {ENV} from "./env.js";

export const connectdb = async () => {
    try{
await mongoose.connect(ENV.DB_URL)
        console.log("Database connected successfully");

    }catch(err){
        console.error("Database connection error:", err);
        process.exit(1);
    }

}