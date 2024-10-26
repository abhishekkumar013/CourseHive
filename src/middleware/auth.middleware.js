import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorHandler } from "../utils/ErrorHandler";

export const isLogin=asyncHandler(async(req,res,next)=>{
    try {
        const token =
        req.cookies?.token ||
        req.header('Authorization')?.replace('Bearer ', '')
  
      if (!token) {
        throw new ErrorHandler('Unauthorized Request',401);
      }
  
      const decode = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(decode?._id).select(
        '-password',
      )
  
      if (!user) {
        throw new ApiError(401, 'Invalid Access Token')
      }
      req.user = user
      next()
    } catch (error) {
        next(error)
    }
})