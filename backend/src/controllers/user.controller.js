import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Center } from "../models/center.model.js"
import { Slots } from "../models/slots.model.js"
import mongoose, { mongo } from "mongoose"
import { Vaccinelist } from "../models/vaccine.model.js"
import { Appointment } from "../models/appointment.model.js"
const generateAccessAndRefreshTokens = async (userId)=>{
     try {
        const user=await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken =  user.generateRefreshToken();

        //refresh token database mei save kardo
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
    return { accessToken, refreshToken };
     } catch (error) {
    console.error("TOKEN ERROR:", error);  // log the actual error
    throw new ApiError(500, "Something went wrong while generating tokens");
}
} 

const userRegister=  asyncHandler(async(req,res)=>{
    const {fullname,adhar_number,contact,email,password,bloodgroup,age} = req.body
    if ([fullname, adhar_number, contact, email, password, bloodgroup, age].some(field => !field || field.trim?.() === "")){
        throw new ApiError(500, "all fields required")
    }
    const existeduser = await User.findOne({
    $or: [{ adhar_number: adhar_number }, { email: email.toLowerCase() }]
    })
    if(existeduser)
    {
          return res.status(400).json(new ApiError(401, {},"user/Aadhar already exists" ))
    }
    const user=await User.create({
        fullname,
        email:email.toLowerCase(),
        contact,
        password,
        adhar_number,
        bloodgroup,
        age
    })
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  //ye password aur refreshtoken hata deta hai
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginuser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if([email,password].some(field=>!field))
    {
        throw new ApiError(400, "field missing")
    }
    const user = await User.findOne({ email });
    if(!user)
    {
        throw new ApiError(404, "USER NOT FOUND")
    }
    const ispasswordvalid =await user.ispasswordcorrect(password);
    if(!ispasswordvalid)
    {
         return res.status(400).json(new ApiError(401, {},"wrong password" ))
    }
    
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    // now cookie operation
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const userlogout= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
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
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const changePassword= asyncHandler(async(req,res)=>{
    const {email,oldpassword,newpassword}= req.body
    if([email,oldpassword,newpassword].some(field=>!field || field.trim()===""))
    {
        throw new ApiError(401,"Field empty")
    }
    const user=await User.findOne({email})
    if(!user)
    {
        throw new ApiError(401, "NOT A VALID USER")
    }
    const ispasswordvalid=await user.ispasswordcorrect(oldpassword)
    if(!ispasswordvalid)
    {
        throw new ApiError(400,"PASSWORD INVALID")
    }
    user.password=newpassword
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200,{}, "password changed successfully"))
})

const findcenterbypincode = asyncHandler(async(req,res)=>{
    const {pincode}= req.query
    if(!pincode){
        throw new ApiError(404," pincode field empty");
    }
    const centerlist=await Center.aggregate([
        {
            $match: { pincode : pincode}
        },
        {
            $project: {        // Limits the fields returned — includes only name and address
             _id: 1,           
             name: 1,          // Include name
             address: 1,    // Include address
            }
        }
    ])
    
    if(centerlist.length==0)
    {
        return res.status(200).json(new ApiResponse(200, centerlist, "NO centers present at this pincode"));
    }
    return res.status(200).json(new ApiResponse(200, centerlist, "Filtered centers by pincode"));
})

const getSlotByCenter= asyncHandler(async(req,res)=>{
  const { centerId } = req.query;
  //console.log(centerId);
  
  if (!mongoose.Types.ObjectId.isValid(centerId)) {
    throw new ApiError(400, "Invalid center ID");
  }
  const slotlist=await Slots.aggregate([
    {
        $match:{ center : new mongoose.Types.ObjectId(centerId)},
    },
    {
        $project:{
        _id:1,
        timeSlot:1,
        date:1
        }
    }
    ]
  )
  return res.status(200).json(new ApiResponse(200, slotlist, "Slots fetched"));
}) 

const bookAppointment = asyncHandler(async (req, res) => {
  const { centerId, slotId, vaccineId } = req.body
  const userId = req.user._id;

  // ✅ Validate ObjectId
  if (
    !mongoose.Types.ObjectId.isValid(centerId) ||
    !mongoose.Types.ObjectId.isValid(slotId) ||
    !mongoose.Types.ObjectId.isValid(vaccineId)
  ) {
    throw new ApiError(400, "Invalid ID(s) provided")
  }

  // ✅ Check if center exists
  const center = await Center.findById(centerId);
  if (!center) throw new ApiError(404, "Center not found");

  // ✅ Check if slot exists
  const slot = await Slots.findById(slotId);
  if (!slot) throw new ApiError(404, "Slot not found");

  // ✅ Check if slot belongs to the center
  if (slot.center.toString() !== centerId.toString()) {
    throw new ApiError(400, "Slot does not belong to this center");
  }

  // ✅ Check if vaccine exists
  const vaccine = await Vaccinelist.findById(vaccineId);
  if (!vaccine) throw new ApiError(404, "Vaccine not found");

  // ✅ Check slot availability
  if (slot.bookedCount >= slot.capacity) {
    throw new ApiError(400, "Slot is fully booked");
  }

  // ✅ Prevent duplicate appointment for same user, slot
  const existing = await Appointment.findOne({ userId:userId , slot:slotId, vaccine:vaccineId , status:"Scheduled"});
  if (existing) {
    return res.status(400).json(new ApiError(401, {},"you already have this appointment for this vaccine" ))
  }

  // ✅ Book appointment
  const appointment = await Appointment.create({
    userId:userId,
    center: centerId,
    vaccine: vaccineId,
    slot: slotId
  });

  //   await User.findByIdAndUpdate(userId,
  //     { $push: { appointments: appointment._id } },
  //     { new: true }
  // );

  // ✅ Increment bookedCount in slot
  slot.bookedCount += 1;
  await slot.save();
const populatedAppointment = await Appointment.findById(appointment._id)
    .populate({
      path: 'center',
      select: 'name address' // Select only the fields you need
    })
    .populate({
      path: 'slot',
      select: 'timeSlot date' // Select only the fields you need
    })
    .populate({
      path: 'vaccine',
      select: 'name manufacturer' // Select only the fields you need
    });
  return res
    .status(201)
    .json(new ApiResponse(201, populatedAppointment, "Appointment booked successfully"));
});

const getUserAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const appointments = await Appointment.find({ userId, status: "Scheduled" })
    .populate("center", "name address")
    .populate("vaccine", "name")
    .populate("slot", "date timeSlot")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, appointments, "User appointments fetched"));
});

const getUserAppointmentsHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const appointments = await Appointment.find({
    userId,
    status: { $in: ["Completed", "Cancelled"] }
  })
    .populate("center", "name address")
    .populate("vaccine", "name")
    .populate("slot", "date timeSlot")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, appointments, "User appointments history fetched"));
});

const getvaccineandslotsbycenter = asyncHandler(async (req, res) => {
  const { centerId } = req.query;

  // 1. Fetch center and populate the vaccines.vaccineId field
  const center = await Center.findById(centerId).populate({
    path: 'vaccines.vaccineId',
    model: 'Vaccinelist'
  });

  if (!center) {
    return res.status(404).json({
      statusCode: 404,
      success: false,
      data: null,
      errors: "Center not found"
    });
  }

  // 2. Fetch slots for this center
  const slotDocs = await Slots.find({ center: centerId });

  // 3. Map vaccines to the expected frontend format
  const formattedVaccines = center.vaccines.map((v) => {
    const vac = v.vaccineId;

    if (!vac) {
      return null;
    }

    return {
      id: vac._id,
      name: vac.name,
      price: vac.price,
      manufacturer: vac.manufacturer,
      available: v.stock , // This correctly determines availability
      description: vac.description,
      doses: vac.doses
    };
  }).filter(v => v !== null);

  // 4. Map slots to the expected frontend format
 const formattedSlots = slotDocs.map((slot, index) => {
    const hour = parseInt(slot.timeSlot.split(":")[0]);
    const type = hour < 12 ? "morning" : hour < 16 ? "afternoon" : "evening";

    return {
      id: slot._id,
      time: slot.timeSlot,
      capacity: slot.capacity,
      booked: slot.bookedCount,
      date: slot.date.toISOString().split("T")[0],
      type: type
    };
  });


  // 5. Construct the final response object with the correct structure
  res.status(200).json({
    statusCode: 200,
    success: true,
    data: {
      vaccines: formattedVaccines,
      slots: formattedSlots
    },
    message: "Vaccines and slots fetched successfully"
  });
});

const cancelappointment = asyncHandler(async(req,res)=>{
  const { appointmentId } = req.query;
  const user = req.user._id;

  // First, check if the appointment exists at all
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json(new ApiError(404, {}, "Appointment not found"));
  }

  // Then, check if the appointment belongs to the authenticated user
  if (appointment.userId.toString() !== user.toString()) {
    return res.status(403).json(new ApiError(403, {}, "Not authorized to cancel this appointment"));
  }
  
  // If all checks pass, proceed with the update
  appointment.status = "Cancelled";
  await appointment.save();

  res.status(200).json({
    message: "Appointment cancelled successfully",
    appointment
  });
});

const viewAppointment=asyncHandler(async(req,res)=>{
  const {appointmentId}=req.query
  const appointments = await Appointment.findById( appointmentId)
    .populate("center", "name address")
    .populate("vaccine", "name")
    .populate("slot", "date timeSlot")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, appointments, "User appointments fetched"));
});

export {userRegister, loginuser, userlogout,
    changePassword, findcenterbypincode,getSlotByCenter
    ,bookAppointment,getUserAppointments,getvaccineandslotsbycenter,
    getUserAppointmentsHistory,cancelappointment,viewAppointment
}