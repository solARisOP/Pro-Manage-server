import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const ConnectDB = async()=>{
    try {
        let db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`connected database on port ${db.connection.port} and host ${db.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1);
    }
}