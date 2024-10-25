import { response } from "express";
import { Enroll } from "../models/enroll.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

export const getAllEnrolledCourse = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.user;

        const enrolledCourses = await Enroll.aggregate([
            {
                $match: { user: mongoose.Types.ObjectId(id), status: "approved" }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            {
                $unwind: "$courseDetails"
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    "courseDetails.title": 1,
                    "courseDetails.description": 1,
                    "courseDetails.price": 1,
                    "courseDetails.duration": 1
                }
            }
        ]);

        if (!enrolledCourses|| enrolledCourses.length===0) {
            throw new ErrorHandler('No approved enrolled courses found', 404);
        }

        res.status(200).json(new ApiResponse(200, enrolledCourses, 'Approved enrolled courses fetched successfully'));
    } catch (error) {
        next(error);
    }
});


export const updateEnrollStatus = asyncHandler(async (req, res, next) => {
    try {
        const {userid,courseid,status}=req.body

        if (!userid || !mongoose.Types.ObjectId.isValid(userid)) {
            throw new ErrorHandler('Invalid User id',400)
        }
        
        if (!courseid || !mongoose.Types.ObjectId.isValid(courseid)) {
            throw new ErrorHandler('Invalid Course id',400)
        }
        const allowedStatuses = ["pending", "approved", "rejected"];

        if (!status || !allowedStatuses.includes(status)) {
            throw new ErrorHandler("Invalid or missing status value",400);
        }

    
        const enrolledUser = await Enroll.findOneAndUpdate(
            { user: userid, course: courseid },
            { status: status },
            { new: true }
        )

        return response.status(200).json(new ApiResponse(200,{},'Successfully Updated'))


    } catch (error) {
        next(error)
    }
})