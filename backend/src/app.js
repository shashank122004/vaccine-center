import express, { urlencoded } from "express"
import cors from 'cors'
import cookieParser from "cookie-Parser"

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))

app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.json({limit:"16kb"}))
app.use(cookieParser())

// app.get("/",(req,res)=>{
//     res.send("hello there this is testing")
// })

// import routers here
import userRouter from "./routers/user.router.js"
import adminRouter from "./routers/admin.router.js"

//user router here
app.use("/api/v1/user", userRouter)
app.use("/api/v1/admin", adminRouter)

export {app}