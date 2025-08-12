import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Center } from "../models/center.model.js"
import { Vaccinelist } from "../models/vaccine.model.js"
import { Slots } from "../models/slots.model.js"
import { Appointment } from "../models/appointment.model.js"
import mongoose from "mongoose"

const generatetokens = async (adminId) => {
  try {
    const admin = await Center.findById(adminId);  // ✅ this gets the full document

    if (!admin) {
      throw new ApiError(404, "ADMIN/center NOT FOUND");
    }

    const accessToken = admin.generateAccessToken(admin._id);
    const refreshToken = admin.generateRefreshToken(admin._id);

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("TOKEN ERROR:", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const adminlogin= asyncHandler(async(req,res)=>{
    const {adminId, password}= req.body
    if([adminId,password].some(field=> !field || field.trim()===""))
    {
        throw new ApiError(401, "empty fiedls")
    }
    const center=await Center.findOne({adminUsername: adminId});
    if(!center)
    {
        throw new ApiError(404, "CENTER not found")
    }
    const ispasswordvalid= await center.ispasswordcorrect(password)
    if(!ispasswordvalid)
    {
        return res.status(400).json(new ApiError(401, {},"wrong password" ))
    }
    const loggedinAdmin=await Center.findById(center._id).select("-adminPassword -refreshToken")

    //cookie 
    const {accessToken,refreshToken}=await generatetokens(center._id)
    const options= {
        httpOnly:true,
        secure:true
    }
   return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedinAdmin, accessToken, refreshToken
            },
            "Admin logged In Successfully"
        )
    )
})

const adminlogout= asyncHandler(async(req,res)=>{
    await Center.findByIdAndUpdate(req.admin._id,
        {
            $unset:
            {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "ADMIN logged Out"))
})

// add center using pincode
const addCenter= asyncHandler(async(req,res)=>{
   const {
    name,
    address,
    city,
    state,
    pincode,
    contactNumber,
    centerId,
    adminUsername,
    adminPassword
  } = req.body;

  if (
    [name, address, city, state, pincode, contactNumber, centerId, adminUsername, adminPassword]
      .some(field => !field || field === "")
  ) {
    throw new ApiError(401, "All fields are required");
  }

  const centerExists = await Center.findOne({ centerId, pincode });
  if (centerExists) {
    throw new ApiError(401, "Center already exists");
  }

  const existingUsername = await Center.findOne({ adminUsername });
  if (existingUsername) {
    throw new ApiError(401, "Admin username already in use");
  }

  const center = await Center.create({
    name,
    address,
    city,
    state,
    pincode,
    contactNumber,
    centerId,
    adminUsername,
    adminPassword
  });

  if (!center) {
    throw new ApiError(500, "Problem creating center");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { centerId: center.centerId }, "Center created successfully"));
})

// addVaccineToCenter / restock at center 
const addVaccineToCenter = asyncHandler(async (req, res) => {
  const { vaccineIds } = req.body; 
  const centerId = req.admin._id;

  const center = await Center.findById(centerId);
  if (!center) {
    throw new ApiError(404, "Center not found");
  }

  // Iterate over the array of vaccine IDs
  for (const vaccineId of vaccineIds) {
    const vaccineObjectId = new mongoose.Types.ObjectId(vaccineId);

    const vaccine = await Vaccinelist.findById(vaccineObjectId);
    if (!vaccine) {
      console.warn(`Skipping invalid vaccine ID: ${vaccineId}`);
      continue;
    }

    // Check if the vaccine already exists in the center's list
    const existing = center.vaccines.find(
      (v) => v.vaccineId && v.vaccineId.toString() === vaccineObjectId.toString()
    );

    if (!existing) {
      center.vaccines.push({ vaccineId: vaccineObjectId });
    }
  }

  await center.save();

  res
    .status(200)
    .json(new ApiResponse(200, center, "Vaccines added to center"));
});

//controlled by center body(me) to add any vaccine at master list
const addToVaccineList = asyncHandler(async (req, res) => {
  const { id, name, manufacturer, doses, price, available, description } = req.body;

  // Validation
  if ([id, name, manufacturer, doses, price, description].some(field =>
    !field || (typeof field === "string" && field.trim() === "")
  ) || typeof available !== "boolean") {
    throw new ApiError(400, "All fields including id, name, manufacturer, doses, price, description and boolean 'available' are required");
  }

  // Check for existing vaccine by name or ID (both should be unique ideally)
  const existing = await Vaccinelist.findOne({ $or: [{ id }, { name }] });
  if (existing) {
    throw new ApiError(409, "Vaccine with this ID or name already exists in the list");
  }

  const vaccine = await Vaccinelist.create({
    id, name, manufacturer, doses, price, available, description
  });

  res.status(201).json(
    new ApiResponse(201, vaccine, "Vaccine added to master list")
  );
});

const createSlot= asyncHandler(async(req,res)=>{
   const {timeSlot, capacity}= req.body
   const centerId=req.admin._id
   const center= Center.findById(centerId)
   if(!center)
   {
      throw new ApiError(404, "center not found")
   }
   // Set current date with time reset to 00:00 to avoid time-based duplication issues
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check for existing slot with same center, date, and timeSlot
  const existingSlot = await Slots.findOne({
    center: centerId,
    date: today,
    timeSlot: timeSlot
  });

  if (existingSlot) {
    throw new ApiError(409, "Slot already exists for this time and date");
  }
   const slot = await Slots.create({
    center: centerId,
    date: today,
    timeSlot,
    capacity
  });

  return res.status(201).json(new ApiResponse(201, slot, "Slot created"));
});

const getAppointmentsForAdmin = asyncHandler(async (req, res) => {
  const centerId = req.admin._id;

  // 1. Get the start and end of the current day in UTC
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the start of today
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Set to the start of tomorrow

  // 2. Find all slots for the admin's center that fall within today's date range
  const todaySlots = await Slots.find({
    center: centerId,
    date: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  // 3. Extract the IDs of the slots found for today
  const todaySlotIds = todaySlots.map(slot => slot._id);

  // 4. Find all appointments for the admin's center that use one of today's slot IDs
  const appointments = await Appointment.find({
    center: centerId,
    slot: { $in: todaySlotIds },
  })
    .populate("userId", "fullname email")
    .populate("slot", "date timeSlot")
    .populate("vaccine", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, appointments, "Appointments for the current date fetched"));
});


const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.query;
  const { status } = req.query; // "Completed" or "Cancelled"

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json(new ApiResponse(200, appointment, "Appointment status updated"));
});

const showvaccinelist= asyncHandler(async(req,res)=>{
    const vaccines = await Vaccinelist.find({},{name:1, manufacturer:1, price:1})
    if(vaccines.length == 0 )
    {
        return res.status(200).json(new ApiResponse(200, vaccines, "No vaccines available"));
    }
      return res.status(200).json(new ApiResponse(200, vaccines, "Vaccines fetched successfully"));
})

export {adminlogin,adminlogout,addCenter, 
      addVaccineToCenter, addToVaccineList,
      createSlot,getAppointmentsForAdmin,
      updateAppointmentStatus,showvaccinelist}