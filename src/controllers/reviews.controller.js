import { json } from "express"
import {  Reviews} from "../models/reviews.model.js"
import { asyncHandler } from "../utils/asyncHandler"
import { ErrorHandler } from "../utils/ErrorHandler"
import { ApiResponse } from "../utils/ApiResponse"


export const createReview=asyncHandler(async(req,res,next)=>{
    try {
        const {course,rating,comment} = req.body
        const {id} = req.user

        if(!course || !rating ){
            throw new ErrorHandler('Give Rating',404)
        } 
        const existingReview=await Reviews.find({user:id, course})

        if(existingReview){
            return res.status(200).json(new ApiResponse(200,{Review:existingReview},'Review already exists for this course and user'))
        }

        const Review=await Reviews.create({
            user:id,
            course,
            rating,
            comment:comment || ''
        })

        return res.status(201).json(new ApiResponse(201,Review,'Review created successfully'))
    } catch (error) {
        next(error)
    }
})

export const updateReview=asyncHandler(async(req,res,next)=>{
    try {
        const {review,course,rating,comment} = req.body
        const {id} = req.user

        if(!course || !rating || !review ){
            throw new ErrorHandler('something went wrong',404)
        } 
        const existingReview=await Reviews.find({user:id, course})

        if(!existingReview){
            throw new ErrorHandler('Review not found',404)
        }

        const Review=await Reviews.findByIdAndUpdate(
            review,
            {
                rating,
                comment:comment||''
            } ,
            { new: true }
        )

        return res.status(201).json(new ApiResponse(201,Review,'Review updated successfully'))
    } catch (error) {
        next(error)
    }
})

export const deleteReview=asyncHandler(async(req,res,next)=>{
    try {
        const {review} = req.body
        if(!review){
            throw new ErrorHandler('review id required',404)
        }
        const deletedReview=await Reviews.findByIdAndDelete(review)

        return res.status(204).json(new ApiResponse(204,deleteReview,'Review deleted successfully'))
    } catch (error) {
        next(error)
    }
})

export const getReviewsByCourse=asyncHandler(async(req,res,next)=>{
    try {
        const {course} = req.body
        if(!course){
            throw new ErrorHandler('course id required',404)
        }

        const reviews = await Reviews.aggregate([
            {
                $match: { course: mongoose.Types.ObjectId(course) }, 
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'user', 
                    foreignField: '_id', 
                    as: 'userDetails', 
                },
            },
            {
                $unwind: '$userDetails', 
            },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    comment: 1,
                    'userDetails.name': 1,
                    'userDetails.image': 1, 
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        if(!reviews || reviews.length==0){
            throw new ErrorHandler('No reviews found',404)
        }

        return res.status(200).json(new ApiResponse(200,reviews,'successfully get all review'))
    } catch (error) {
        next(error)
    }
})