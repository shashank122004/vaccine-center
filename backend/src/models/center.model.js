import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const centerSchema = new mongoose.Schema({
  name: String,
  centerId:String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  contactNumber: String,
  vaccines: [
  {
    vaccineId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ important
      ref: "Vaccinelist",
      required: true,
    }
  }
],
  adminUsername: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true }, // hashed using bcrypt
  refreshToken: String
});

centerSchema.pre("save", async function (next) {
  if (!this.isModified("adminPassword")) return next();
  this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
  next();
});

centerSchema.methods.ispasswordcorrect=function(password){
   return bcrypt.compare(password,this.adminPassword)
}

centerSchema.methods.generateAccessToken = function(){
    return jwt.sign(
    {
        _id:this._id,
        adminUsername:this.adminUsername
    },
    process.env.ADMIN_ACCESS_TOKEN,
    {
        expiresIn:"1d"
    }
    )
} 
centerSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        adminUsername:this.adminUsername
    },
    process.env.ADMIN_REFRESH_TOKEN,
    {
        expiresIn:"7d"
    }
)
} 

export const Center= mongoose.model("Center", centerSchema)