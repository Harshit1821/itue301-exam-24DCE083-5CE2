const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: false, // Optional for lightweight direct form testing, populated when linked
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: false,
    },
    // Supporting both direct names (for Task 1-4 lightweight flow) and references (for Task 5 Mongoose flow)
    patientName: {
      type: String,
      trim: true,
    },
    doctorName: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Appointment date is required'],
      trim: true,
    },
    timeslot: {
      type: String,
      required: [true, 'Appointment timeslot is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled'],
        message: 'Invalid appointment status. Allowed: pending, confirmed, cancelled',
      },
      default: 'pending',
    },
    reason: {
      type: String,
      maxlength: [100, 'Reason cannot exceed 100 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
