import express from "express"
import { Router } from "express"
import { userRegister,loginuser,userlogout,changePassword,
    findcenterbypincode,getSlotByCenter,
    bookAppointment,getUserAppointments,getvaccineandslotsbycenter,getUserAppointmentsHistory,
    cancelappointment,viewAppointment
 } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router=express.Router()

router.post("/register",userRegister)
router.post("/login", loginuser)
router.post("/logout",verifyJWT, userlogout)
router.post("/change-password", changePassword)
router.get("/find-center-by-pincode", findcenterbypincode)
router.get("/get-vaccine-slot-details", getvaccineandslotsbycenter)
router.post("/book-appointment",verifyJWT, bookAppointment)
router.get("/get-appointments",verifyJWT,getUserAppointments)
router.get("/appointments-history",verifyJWT,getUserAppointmentsHistory)
router.patch("/cancel-appointment",verifyJWT,cancelappointment)
router.get("/view-appointments",viewAppointment)
export default router