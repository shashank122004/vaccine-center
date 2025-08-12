 import mongoose from "mongoose";

const vaccineSchema = new mongoose.Schema({
  name: String,
  price: Number,
  manufacturer: String,
  available: Boolean,
  description: String,
  doses: String
});

export const Vaccinelist  = mongoose.model("Vaccinelist", vaccineSchema);
