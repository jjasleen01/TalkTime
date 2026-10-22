import mongoose from "mongoose";

//function to connect to mongodb 
export const connectDB = async ()=>{
    try{
        mongoose.connection.on("connected", ()=>{
            console.log("Database connected");
        })
        
        await mongoose.connect(process.env.MONGODB_URI);
    }catch(err){
        console.log(err);
    }
}