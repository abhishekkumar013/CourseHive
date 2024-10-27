import express from 'express'
import { isLogin } from '../middleware/auth.middleware.js'
import { createReview, deleteReview, getReviewsByCourse, updateReview } from '../controllers/reviews.controller.js'

const router=express.Router()

router.use(isLogin)

router.route('/').post(createReview).get(getReviewsByCourse).patch(updateReview).delete(deleteReview)

export default router