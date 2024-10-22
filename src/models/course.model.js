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
        required:true,
        min:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    lessons: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Lesson" 
        }
    ],
    reviews: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Review" 
        }
    ],
},{timestamps:true})

export default Course =mongoose.model('Course',courseSchema);;