import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending", "completed", "failed"],
        default:'pending'
    },
    paymentDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    transactionId:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Payment =mongoose.model('Payment', paymentSchema);;