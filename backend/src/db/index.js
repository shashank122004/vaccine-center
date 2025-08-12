import {DB_NAME} from "../constant.js"
import mongoose from "mongoose"


const connectDB= async()=>{
    try {
        const connectioninstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("successfully connected to database",connectioninstance.connection.host)
    } catch (error) {
        console.log("faild connecting to DATABASE",error)
    }
}

export default connectDB