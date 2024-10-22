import mongoose from "mongoose";

const connectDb=async()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`DB connected successfully ${connectionInstance.connection.name}`)
        
    } catch (error) {
        console.log('Error in DB connection')
        process.exit(1)
    }
}

export default connectDb;