const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medicare_hospital';

// 1. Built-in and Third-Party Middlewares
app.use(cors());
app.use(express.json());

// 2. Custom Request Logger Middleware (Applied Globally)
app.use(requestLogger);

// In-memory fallback data (Task 3 Requirement)
let inMemoryDoctors = [
  {
    _id: 'doc_1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@medicare.com',
    specialisation: 'Cardiology',
    available: true,
  },
  {
    _id: 'doc_2',
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@medicare.com',
    specialisation: 'Neurology',
    available: true,
  },
  {
    _id: 'doc_3',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@medicare.com',
    specialisation: 'Pediatrics',
    available: false,
  },
  {
    _id: 'doc_4',
    name: 'Dr. Michael Patel',
    email: 'michael.patel@medicare.com',
    specialisation: 'Orthopedics',
    available: true,
  },
  {
    _id: 'doc_5',
    name: 'Dr. Aisha Khan',
    email: 'aisha.khan@medicare.com',
    specialisation: 'Dermatology',
    available: true,
  },
];

let inMemoryAppointments = [
  {
    _id: 'apt_1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-08-25',
    timeslot: '10:00 AM',
    status: 'confirmed',
    reason: 'Routine cardiovascular follow-up check',
  },
  {
    _id: 'apt_2',
    patientName: 'Priya Patel',
    doctorName: 'Dr. Rajesh Sharma',
    date: '2026-08-26',
    timeslot: '11:30 AM',
    status: 'pending',
    reason: 'Migraine consultation and evaluation',
  },
  {
    _id: 'apt_3',
    patientName: 'David Miller',
    doctorName: 'Dr. Michael Patel',
    date: '2026-08-27',
    timeslot: '02:00 PM',
    status: 'cancelled',
    reason: 'Knee joint ache assessment',
  },
];

let isDbConnected = false;

// Connect to MongoDB using Mongoose (Task 5 Requirement)
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    isDbConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);
    // Seed initial doctors if DB empty
    try {
      const count = await Doctor.countDocuments();
      if (count === 0) {
        await Doctor.insertMany(
          inMemoryDoctors.map(({ _id, ...rest }) => rest)
        );
        console.log('[MongoDB] Initial doctors seeded to database.');
      }
    } catch (seedErr) {
      console.warn('[MongoDB] Seeding check skipped:', seedErr.message);
    }
  })
  .catch((err) => {
    console.warn(`[MongoDB] Connection warning (using in-memory fallback): ${err.message}`);
  });

// --- REST Endpoints (Task 3 Requirement) ---

// Root welcome & health status
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MediCare Plus Hospital Appointment API',
    database: isDbConnected ? 'Connected (MongoDB)' : 'In-Memory Mode',
    endpoints: [
      'GET  /api/v1/doctors',
      'GET  /api/v1/appointments',
      'POST /api/v1/appointments',
      'POST /api/v1/test/seed',
      'POST /api/v1/test/validate-failure?type=missing_field|blood_group|status|reason_length',
    ],
  });
});

// 1. GET /api/v1/doctors -> Return all doctors (Status 200)
app.get('/api/v1/doctors', async (req, res, next) => {
  try {
    if (isDbConnected) {
      const doctors = await Doctor.find();
      if (doctors && doctors.length > 0) {
        return res.status(200).json(doctors);
      }
    }
    return res.status(200).json(inMemoryDoctors);
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/v1/appointments -> Return all appointments (Status 200)
app.get('/api/v1/appointments', async (req, res, next) => {
  try {
    if (isDbConnected) {
      const appointments = await Appointment.find()
        .populate('patientId', 'name email phone bloodGroup age')
        .populate('doctorId', 'name specialisation email')
        .sort({ createdAt: -1 });

      if (appointments && appointments.length > 0) {
        // Map data to ensure patientName & doctorName are consistently present
        const formatted = appointments.map((apt) => ({
          _id: apt._id,
          patientName: apt.patientName || (apt.patientId ? apt.patientId.name : 'Unknown Patient'),
          doctorName: apt.doctorName || (apt.doctorId ? apt.doctorId.name : 'Unknown Doctor'),
          date: apt.date,
          timeslot: apt.timeslot,
          status: apt.status,
          reason: apt.reason,
          patientId: apt.patientId,
          doctorId: apt.doctorId,
        }));
        return res.status(200).json(formatted);
      }
    }
    return res.status(200).json(inMemoryAppointments);
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/v1/appointments -> Create a new appointment (Status 201)
app.post('/api/v1/appointments', async (req, res, next) => {
  try {
    const { patientName, doctorName, date, timeslot, status, reason, patientId, doctorId } = req.body;

    // Basic payload validation
    if (!patientName && !patientId) {
      const err = new Error('Patient name is required');
      err.statusCode = 400;
      throw err;
    }
    if (!doctorName && !doctorId) {
      const err = new Error('Doctor name is required');
      err.statusCode = 400;
      throw err;
    }
    if (!date) {
      const err = new Error('Appointment date is required');
      err.statusCode = 400;
      throw err;
    }
    if (!timeslot) {
      const err = new Error('Appointment timeslot is required');
      err.statusCode = 400;
      throw err;
    }

    const appointmentData = {
      patientName: patientName || 'Patient',
      doctorName: doctorName || 'Doctor',
      date,
      timeslot,
      status: status || 'pending',
      reason: reason || '',
      patientId: patientId || undefined,
      doctorId: doctorId || undefined,
    };

    if (isDbConnected) {
      const newAppointment = new Appointment(appointmentData);
      const saved = await newAppointment.save();
      // Keep in-memory synced as well
      inMemoryAppointments.unshift(saved);
      return res.status(201).json(saved);
    } else {
      const newAppointment = {
        _id: 'apt_' + (inMemoryAppointments.length + 1) + '_' + Date.now(),
        ...appointmentData,
      };
      inMemoryAppointments.unshift(newAppointment);
      return res.status(201).json(newAppointment);
    }
  } catch (error) {
    next(error);
  }
});

// --- Task 5: Demonstration Endpoints for MongoDB & Mongoose Schemas ---

// A. Demonstrate MongoDB Operation (Seeding Patients, Doctors, and populated Appointments)
app.post('/api/v1/test/seed', async (req, res, next) => {
  try {
    if (!isDbConnected) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is not connected. Please ensure MONGO_URI is configured.',
      });
    }

    // 1. Create Patient
    const samplePatient = new Patient({
      name: 'Rohan Sharma',
      email: `rohan.${Date.now()}@example.com`,
      phone: '+91 98765 43210',
      bloodGroup: 'O+',
      age: 28,
    });
    const savedPatient = await samplePatient.save();

    // 2. Create Doctor
    const sampleDoctor = new Doctor({
      name: 'Dr. Ananya Mehta',
      email: `ananya.${Date.now()}@medicare.com`,
      specialisation: 'Cardiology',
      available: true,
    });
    const savedDoctor = await sampleDoctor.save();

    // 3. Create Appointment with references
    const sampleAppointment = new Appointment({
      patientId: savedPatient._id,
      doctorId: savedDoctor._id,
      patientName: savedPatient.name,
      doctorName: savedDoctor.name,
      date: '2026-09-01',
      timeslot: '09:30 AM',
      status: 'confirmed',
      reason: 'Routine cardiac health review',
    });
    const savedAppointment = await sampleAppointment.save();

    // 4. Retrieve with Mongoose .populate()
    const populated = await Appointment.findById(savedAppointment._id)
      .populate('patientId')
      .populate('doctorId');

    res.status(201).json({
      success: true,
      message: 'Task 5 Demonstration: MongoDB schemas created & referenced successfully!',
      patient: savedPatient,
      doctor: savedDoctor,
      populatedAppointment: populated,
    });
  } catch (error) {
    next(error);
  }
});

// B. Demonstrate Mongoose Validation Failures (Task 5 Requirement)
// Test scenarios: 'missing_field', 'blood_group', 'status', 'reason_length'
app.post('/api/v1/test/validate-failure', async (req, res, next) => {
  try {
    const type = req.query.type || req.body.type || 'missing_field';

    let testDoc;

    if (type === 'missing_field') {
      // 1. Missing required field (Patient without name and email)
      testDoc = new Patient({
        phone: '1234567890',
        age: 30,
      });
    } else if (type === 'blood_group') {
      // 2. Invalid blood group (Not in enum)
      testDoc = new Patient({
        name: 'Invalid Blood Test',
        email: `invalid.blood.${Date.now()}@example.com`,
        bloodGroup: 'Z_POSITIVE_INVALID',
      });
    } else if (type === 'status') {
      // 3. Invalid appointment status (Not in enum)
      testDoc = new Appointment({
        date: '2026-08-25',
        timeslot: '10:00 AM',
        status: 'under_investigation_invalid_status',
      });
    } else if (type === 'reason_length') {
      // 4. Reason exceeding 100 characters
      const longReason = 'This reason string is intentionally crafted to exceed the maximum allowed length of one hundred characters in the Mongoose schema.'.repeat(2);
      testDoc = new Appointment({
        date: '2026-08-25',
        timeslot: '10:00 AM',
        status: 'pending',
        reason: longReason,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid test type. Use: missing_field, blood_group, status, or reason_length',
      });
    }

    // Trigger Mongoose Schema Validation
    await testDoc.validate();

    // If validation didn't fail (should not happen)
    res.json({ success: true, message: 'Unexpected: Document passed validation' });
  } catch (error) {
    // Pass to global errorHandler to return structured JSON
    next(error);
  }
});

// Fallback 404 for undefined routes
app.use((req, res, next) => {
  const err = new Error(`Cannot ${req.method} ${req.originalUrl} - Route Not Found`);
  err.statusCode = 404;
  next(err);
});

// 4. Global Error Handling Middleware (Registered as the LAST middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] MediCare Plus Backend running on port ${PORT}`);
  console.log(`[Server] Ready to accept requests.`);
});
