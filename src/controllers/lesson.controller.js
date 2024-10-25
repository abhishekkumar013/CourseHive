import { Lesson } from "../models/lesson.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getAllLessonOfCourse = asyncHandler(async (req, res, next) => {
    try {
        const { cid } = req.params;

        const courseWithLessons = await Lesson.aggregate([
            {
                $match: { course: mongoose.Types.ObjectId(cid) }
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
                $group: {
                    _id: "$course",
                    courseDetails: { $first: "$courseDetails" },
                    lessons: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            content: "$content",
                            videoUrl: "$videoUrl",
                            duration:"$duration",
                            createdAt: "$createdAt",
                            updatedAt: "$updatedAt"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    courseDetails: 1,
                    lessons: 1
                }
            }
        ]);

        if (!courseWithLessons || courseWithLessons.length===0) {
          throw new ErrorHandler("No lessons found for this course", 404);
        }

        res.status(200).json(courseWithLessons[0]);
    } catch (error) {
        next(error);
    }
});
