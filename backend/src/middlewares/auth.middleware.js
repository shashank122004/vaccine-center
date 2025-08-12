import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { Center } from "../models/center.model.js";

const verifyJWT= asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token)
        {
            throw new ApiError(401, "token not found")
        }
        //decode token to match with database wala token
        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN)
        const user= await User.findById(decodedtoken?._id).select("-password -refreshToken")
        if(!user)
        {
            throw new ApiError(401, "INVALID TOKEN ACCESS")
        }
        req.user=user
        next()
    } catch (error) {
        return res.status(400).json(new ApiError(401, {},"invalid access" ))
    }
})

const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Token not found");
        }

        const decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN); // or ADMIN_JWT_SECRET
        if (!decodedToken || !decodedToken._id) {
            throw new ApiError(401, "Invalid token payload");
        }

        const admin = await Center.findById(decodedToken._id).select("-adminpassword");

        if (!admin) {
            throw new ApiError(401, "Invalid token access");
        }
        
        req.admin = admin;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        throw new ApiError(401, "Unauthorized: Invalid or expired token");
    }
});



export {verifyJWT,verifyAdminJWT}