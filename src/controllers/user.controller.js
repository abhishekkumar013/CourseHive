import User from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ErrorHandler } from "../utils/ErrorHandler.js";
import sendMail from '../utils/sendMail.js';

export const RegisterController=asyncHandler(async(req, res, next)=>{
    try {
        const { name,email,password,confirmPassword,image,role}=req.body;

        // Validate input
        if (
            [name,email,password,confirmPassword].some((field) => field?.trim() === '')
          ) {
            throw new ErrorHandler('All Fields Required', 404)
        }
        if(password!==confirmPassword) {
            throw new ErrorHandler('Password and Confirm Password not Matched', 404)
        }
        // Check if user already exists
        let user=await User.findOne({email})
        if(!user){
            const imaeLocalPath = req.file?.path
            if (!imaeLocalPath) {
                throw new ErrorHandler('Image File is  missing', 400)
            }
            const avatar = await uploadOnCloudinary(avatarLocalPath)

            if (!avatar || !avatar?.url) {
            
                throw new ErrorHandler('Error while uploading image', 400)
            }

            user=await User.create({name,
                email,
                password,
                image:avatar.url||'',
                role
            })
        }
        

        const otp = Math.floor(Math.random() * 1000000)

        const verifytoken = await user.generateVerifyToken(otp)

        await sendMail(email,'Corsu',otp)
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        }
        return res
            .status(200)
            .cookie('verifytoken',verifytoken,options)
            .json(new ApiResponse(200,{},'OTP Send Successfully'))
    } catch (error) {
        next(error)
    }
})

export const VerifyUser = asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.user
      console.log(id)
      const user = await User.findByIdAndUpdate(
        id, 
        { isVerified: true }, 
        { new: true } 
      );
    
     
      res.clearCookie('verifytoken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      })
      const token = user.generateAccesstoken()
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }
      return res
        .status(200)
        .cookie('token', token, options)
        .json(new ApiResponse(200, user, 'User Login SuccessFully '))
    } catch (error) {
      next(error)
    }
})


export const VerifyUserEmail = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.body

        let user = await User.findOne({ email })
    
        if (!user) {
          throw new ErrorHandler('User not found', 404)
        }

        if(user.isVerified){
            throw new ErrorHandler('User Already Verified', 400)
        }
    
        const otp = Math.floor(Math.random() * 1000000)
    
        const verifytoken = await user.generateVerifyToken(otp)
    
        await sendMail(email, 'ChatBot', otp)
    
        const options = {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        }
        return res
          .status(200)
          .cookie('verifytoken', verifytoken, options)
          .json(new ApiResponse(200, {}, 'OTP Send Successfully'))
    } catch (error) {
      next(error)
    }
})


export const LoginController=asyncHandler(async(req, res, next)=>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            throw new ErrorHandler('All fields are required',404)
        }
        const  user=await User.findOne({email})
        if(!user){
            throw new ErrorHandler('User not found',404)
        }
        if(!user.isVerified){
            throw new ErrorHandler('User not Verified',400)
        }
        const match=await user.isPasswordCorrect(password)
        if(!match){
            throw new ErrorHandler('Invalid  Credentials',404)
        }
        const token=user.generateAccesstoken()

        const loginUser=await User.findOne({email}).select("-password")
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        }
        return res
            .status(200)
            .cookie('token',token,options)
            .json(new ApiResponse(200,{user:loginUser,token}))

    } catch (error) {
        next(error)
    }
})

export const getProfile=asyncHandler(async(req, res, next)=>{
    try {
        const {id}=req.user

        const  user=await User.findOne(id).select("-password")
        if(!user){
            throw new ErrorHandler('User not found',404)
        }
        return res.status(200).json(new ApiResponse(200,user,'rofile fetched successfully'))
    } catch (error) {
        next(error)
    }
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.user;
        const { name, role, image } = req.body;

        
        if ([name, role].some((field) => field?.trim() === '')) {
            throw new ErrorHandler('Name and role are required', 400);
        }
        

        
        let user = await User.findById(id);
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }

        
        user.name = name || user.name;
        user.role = role || user.role;


       
        if (req.file) {
            const avatarLocalPath = req.file.path;
            const avatar = await uploadOnCloudinary(avatarLocalPath);
            if (!avatar || !avatar.url) {
                throw new ErrorHandler('Error while uploading image', 400);
            }
            user.image = avatar.url;
        }

        await user.save();

        const updatedUser = await User.findById(id).select("-password");
        return res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
    } catch (error) {
        next(error);
    }
});

export const updatePassword=asyncHandler(async(req, res, next)=>{
    try {
        const {id}=req.user
        const {password,confirmPassword} = req.body;

        if(!password ||!confirmPassword){
            throw new ErrorHandler('All fields are required',404)
        }
        if(password!==confirmPassword){
            throw new ErrorHandler('Password and Confirm Password not Matched',404)
        }
        let user = await User.findById(id);
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }
        user.password=password
        await user.save()
        return res.status(200).json(new ApiResponse(200,{},'Password updated successfully'))

    } catch (error) {
        next(error)
    }
})

export const logout=asyncHandler(async(req,res,next)=>{
    try {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }
        return res
            .status(200)
            .clearCookie('token', options)
            .json(new ApiResponse(200, {}, 'User Logout Successfully'))
        
    } catch (error) {
        next(error)
    }
})

export const forgotPassword=asyncHandler(async(req, res, next)=>{
    try {
        const {oldPassword, newPassword,confirmNewPassword} =req.body
        if(!oldPassword || !newPassword || !confirmNewPassword){
            throw new ErrorHandler('All fields are required',404)
        }
        if(newPassword!==confirmNewPassword){
            throw new ErrorHandler('New Password and Confirm New Password not Matched',404)
        }

        const {id}=req.user
        const user=await User.findById(id)
        const match=user.isPasswordCorrect(oldPassword)
        if(!match){
            throw new ErrorHandler('Invalid Old Password',404)
        }
        user.password=newPassword
        user.save()
        return res.status(200).json(new ApiResponse(200,{},'Password updated successfully'))
    } catch (error) {
        next(error)
    }
})

export const getUser=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.user
        const user=await User.findById(id).select('-password')

        return res.status(200).json(new ApiResponse(200,user,'user data fetched successfully'))
    } catch (error) {
        next(error)
    }
})