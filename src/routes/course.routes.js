import express from 'express'
import { createCourse, deleteCourse, getAllCourse, getAllCourseOfTeacher, getCourseById, updateCourse } from '../controllers/course.controller.js'
import { isLogin } from '../middleware/auth.middleware.js'

const router=express.Router()

router.use(isLogin)

router.route('/create').post(createCourse)
router.route('/get-all').get(getAllCourse)
router.route('/get-all/:teacherId').get(getAllCourseOfTeacher)
router.route('/get/:courseid').get(getCourseById)
router.route('/update/:courseid').patch(updateCourse)
router.route('/delete/:courseid').delete(deleteCourse)



export default router