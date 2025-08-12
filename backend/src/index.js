import dotenv from "dotenv"
dotenv.config(
    {
        path:'./env'
    }
)
import connectDB from "./db/index.js"
import {app} from "./app.js"

//function call to connect to database
connectDB() 
.then(()=>{
    app.listen(process.env.PORT || 8000)
    console.log("server running on",process.env.PORT)
})
.catch(()=>{
    console.log("mongodb connection failed",error)
})

