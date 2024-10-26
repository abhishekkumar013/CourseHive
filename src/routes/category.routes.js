import express from 'express'
import { isLogin } from '../middleware/auth.middleware'
import { isAdmin } from '../middleware/isAdmin.middleware'
import { createCategory, deleteCategory, getCategories } from '../controllers/category.controller'

const router=express.Router()

// check  login and admin
router.use(isLogin)
router.use(isAdmin)

router.route('/create').post(createCategory)
router.route('/delete/:cid').delete(deleteCategory)
router.route('/get-all').get(getCategories)

export default router