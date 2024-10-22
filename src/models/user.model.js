import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase: true,
        trim: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg'
    },
    role:{
        type:String,
        enum:['admin', 'teacher', 'student'],
        default:'student'
    },
    isVerified:{
      type:Boolean,
      default:false
    }

},{timestamps:true})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
  
    this.password = await bcrypt.hash(this.password, 10)
    next()
  })
  
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccesstoken = function () {
    return Jwt.sign(
      {
        // jo jo value jwt se access krna chahate h wo sb likh denge yaha
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      },
    )
}

userSchema.methods.generateVerifyToken = function (otp) {
  return jwt.sign({ id: this._id, otp }, process.env.JWT_SECRETVERIFY, {
    expiresIn: process.env.JWT_EXPIREVERIFY,
  })
}

export default User=mongoose.model("User",userSchema);