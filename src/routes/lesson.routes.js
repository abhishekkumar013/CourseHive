import express from 'express'
import { isLogin } from '../middleware/auth.middleware.js'
import { getAllLessonOfCourse } from '../controllers/lesson.controller'

const router=express.Router()

router.use(isLogin)


router.route('/get-all').get(getAllLessonOfCourse)


export default router