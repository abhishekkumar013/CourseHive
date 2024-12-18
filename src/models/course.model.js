import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    duration:{
        type:Number,
        min:0,
        default: 0,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    
},{timestamps:true})

export const Course =mongoose.model('Course',courseSchema);;