import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    videoUrl: { 
        type: String,
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
    },

},{timestamps: true})

export const Lesson=mongoose.model("Lesson",lessonSchema);