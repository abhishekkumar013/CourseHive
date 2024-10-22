import mongoose from "mongoose";

const CategorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

export default Category =mongoose.model('Category',CategorySchema);;