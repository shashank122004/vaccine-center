import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Use model name string, not variable
    required: true
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccinelist', // Must match model name used in mongoose.model()
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slots',
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);