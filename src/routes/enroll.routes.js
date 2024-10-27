import express from 'express'
import { getAllEnrolledCourse, getEntrolled, updateEnrollStatus } from '../controllers/enroll.controller.js'
import { isLogin } from '../middleware/auth.middleware.js'

const router=express.Router()

router.use(isLogin)

router.route('/').post(getEntrolled).get(getAllEnrolledCourse).patch(updateEnrollStatus)

export default router