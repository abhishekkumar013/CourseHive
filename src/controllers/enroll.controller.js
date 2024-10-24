import { Enroll } from "../models/enroll.model.js";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

export const getEntrolled=asyncHandler(async(req, res, next)=>{
    try {
        const {course,status}=req.body
        if(!course){
            throw new ErrorHandler('Course Id required',404)
        }

        const validStatuses = ["pending", "approved", "rejected"];

        if (status && !validStatuses.includes(status)) {
            throw new ErrorHandler('Invalid status provided', 400);
        }

        const {id}=req.user

        const enrolledUsers=await Enroll.find({user:id,course})

        if(enrolledUsers){
            throw new ErrorHandler('You have already enrolled',400)
        }

        await Enroll.create({user:id,course,status})

        return res.status(201).json(new ApiResponse(200,{},'Enrolled Successfully'))
    } catch (error) {
        next(error)
    }
})