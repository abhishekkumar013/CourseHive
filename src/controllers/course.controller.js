import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


import mongoose from 'mongoose';

export const createCourse = asyncHandler(async (req, res, next) => {
    try {
        const { title, description,  price,  category } = req.body;

        if (
            [title, description,  price,  category].some(
                (field) => !field || field.toString().trim() === ''
            )
        ) {
            throw new ErrorHandler('All fields are required', 400);
        }

        if (isNaN(price) || price < 0) {
            throw new ErrorHandler('Price must be a positive number', 400);
        }
      

        // Validate teacher and category are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(category)) {
            throw new ErrorHandler('Invalid category ID', 400);
        }

        const {id}=req.user
       

        // Create the course
        const course = await Course.create({
            title,
            description,
            teacher:id,
            price,
            category,
        });

        return res.status(201).json(new ApiResponse(201, course, 'Course created successfully'));
    } catch (error) {
        next(error);
    }
});

export const getAllCourse=asyncHandler(async(req,res,next)=>{
    try {
        const courses=await Course.find({})

        if(!courses || courses.length===0){
            throw new ErrorHandler('No courses found',404)
        }
        return res.status(200).json(new ApiResponse(200,courses,'Courses fetched successfully'))
    } catch (error) {
        next(error)
    }
})

export const getAllCourseOfTeacher = asyncHandler(async (req, res, next) => {
    try {
        const { teacherId } = req.params;

        const courses = await Course.aggregate([
            {
                $match: { teacher: mongoose.Types.ObjectId(teacherId) }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'teacher', 
                    foreignField: '_id', 
                    as: 'teacherDetails'
                }
            },
            {
                $unwind: '$teacherDetails'
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    price: 1,
                    duration: 1,
                    category: 1,
                    'teacherDetails.name': 1,
                }
            }
        ]);

        if (!courses || courses.length === 0) {
            throw new ErrorHandler('No courses found for this teacher', 404);
        }

        return res.status(200).json(new ApiResponse(200, courses, 'Courses fetched successfully'));
    } catch (error) {
        next(error);
    }
});


export const getCourseById = asyncHandler(async (req, res, next) => {
    try {
        const {courseid}=req.params
        if(!courseid){
            throw new ErrorHandler('Require course ID',404)
        }
        const course=await Course.findById(courseid)


        return res.status(200).json(new ApiResponse(200, course, 'Course fetched successfully'));
    } catch (error) {
        next(error)
    }
})

export const updateCourse = asyncHandler(async (req, res, next) => {})

export const deleteCourse = asyncHandler(async (req, res, next) => {
    try {
        const { courseid } = req.params;
        const { id: userId } = req.user;

        if (!courseid) {
            throw new ErrorHandler('Course ID is required', 404);
        }

        const course = await Course.findById(courseid);
        
        if (!course) {
            throw new ErrorHandler('Course not found', 404);
        }

       
        if (course.teacher.toString() !== userId.toString()) {
            throw new ErrorHandler('You are not authorized to delete this course', 403);
        }

        await Course.findByIdAndDelete(courseid);

        return res.status(200).json(new ApiResponse(200, null, 'Course deleted successfully'));
    } catch (error) {
        next(error);
    }
});
