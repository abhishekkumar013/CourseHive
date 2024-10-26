import { Category } from "../models/category.model";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import {ApiResponse} from '../utils/ApiResponse.js';

export const createCategory=asyncHandler(async(req,res,next)=>{
    try {
        const {name,description}=req.body
        if(!name || !description){
            throw new ErrorHandler('Name and Description are required',400)
        }

        const category=await Category.create({name,description})

        return res.status(200).json(new ApiResponse(200, category,'category  created successfully'));

    } catch (error) {
        next(error)
    }
})

export const deleteCategory=asyncHandler(async(req,res,next)=>{
    try {
        const {cid}=req.params
    
        await Category.findByIdAndDelete(cid)

        return res.status(200).json(new ApiResponse(200, {},'category  deleted successfully'));

    } catch (error) {
        next(error)
    }
})

export const getCategories=asyncHandler(async(req,res,next)=>{
    try {
        const categories=await Category.find({})

        return res.status(200).json(new ApiResponse(200, categories,'Categories fetched successfully'));
    } catch (error) {
        next(error)
    }
})