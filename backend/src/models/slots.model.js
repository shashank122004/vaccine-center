import mongoose from "mongoose";
import { Center } from "./center.model.js";

const slotSchema = mongoose.Schema({
    center:{type:mongoose.Schema.Types.ObjectId, ref:'Center'},
    date:{
        type:Date,
        expiry:'1d'
    } ,
    timeSlot: String, // "10:00 AM - 10:30 AM"
    capacity: Number,
    bookedCount: { type: Number, default: 0 }
});

export const Slots= mongoose.model("Slots", slotSchema)