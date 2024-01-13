import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
export default async function connectDB(){
    try {
        const connect =  await mongoose.connect(process.env.mongoURL);
        console.log('DB connected! '+connect.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}