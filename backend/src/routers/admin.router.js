import { Router } from "express";
import {verifyAdminJWT} from "../middlewares/auth.middleware.js"
//import admin functions here from controller
import { adminlogin,adminlogout,addCenter, 
    addVaccineToCenter,addToVaccineList,createSlot,
    getAppointmentsForAdmin,updateAppointmentStatus,showvaccinelist
    } from "../controllers/admin.controller.js";
const router=Router()

router.post("/login",adminlogin)
router.post("/logout",verifyAdminJWT, adminlogout)
router.post("/add-center",addCenter)
router.post("/addvaccinetocenter",verifyAdminJWT,addVaccineToCenter)
router.post("/addtovaccinelist",addToVaccineList)
router.post("/createslot",verifyAdminJWT,createSlot)
router.get("/get-appointments",verifyAdminJWT,getAppointmentsForAdmin)
router.patch("/update-appo-status",verifyAdminJWT,updateAppointmentStatus)
router.get("/vaccine-list",showvaccinelist)
export default router

