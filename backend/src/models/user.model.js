import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userschema=mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        lowercase:true,
    },
    contact:{
        type:Number,
        required:true,
    },
    adhar_number:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    refreshToken:{
        type:String,
    },
    bloodgroup:{
        type:String,
    },
    age:{
        type:String
    },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    bookingHistory:[
        { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
    ]
},{ timestamps: true })

userschema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
        this.password= await bcrypt.hash(this.password, 10)
    next()
})

userschema.methods.ispasswordcorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}

userschema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email: this.email,
        fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN,
    {
        expiresIn:"1d"
    }
)
}

userschema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN,
    {
        expiresIn:"10d"
    }
)
}
export const User= mongoose.model("User",userschema)