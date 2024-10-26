import { asyncHandler } from "../utils/asyncHandler";


export const isAdmin=asyncHandler(async(req,res,next)=>{
    try {
        const {id}=req.user
        const user = await User.findById(id)

        if(user.role!=="admin"){
            throw new ErrorHandler('Unauthorized Access',401)
        }
        next()
    } catch (error) {
        next(error)
    }
})