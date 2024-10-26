import express from 'express';
import { forgotPassword, getProfile, LoginController, logout, RegisterController, updatePassword, updateProfile, VerifyUser, VerifyUserEmail } from '../controllers/user.controller.js';

const router=express.Router();

router.route('/register').post(RegisterController)

router.route('/verify').post(VerifyUser)
router.route('/verify/email').post(VerifyUserEmail)
router.route('/login').post(LoginController)
router.route('/get-profile').get(getProfile)
router.route('/update-profile').patch(updateProfile)
router.route('/forgot password').patch(forgotPassword)
router.route('/logout').post(logout)


export default router