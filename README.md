# MediCare Plus — Hospital Appointment System

**Course:** ITUE301 — Advanced Web Development Frameworks  
**Faculty:** Technology and Engineering — CSPIT-IT, Charotar University of Science and Technology  
**Examination:** Open-Book Practical Examination (SET A)  
**Tech Stack:** React + Express.js + MongoDB (Mongoose)

---

## 1. Project Name
**MediCare Plus — Hospital Appointment System**  
A full-stack web application for managing hospital doctors, patient consultations, and appointment scheduling with real-time feedback, REST APIs, custom middlewares, and Mongoose database validation.

---

## 2. Project Structure
```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation across all routes
│   │   │   └── AppointmentCard.jsx     # Reusable component with dynamic status styles
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Landing page with highlights & recent schedule
│   │   │   ├── DoctorsPage.jsx         # Task 4: Asynchronous REST API consumption
│   │   │   └── BookingPage.jsx         # Task 2: Multi-state form with live card preview
│   │   ├── App.jsx                     # React Router configuration
│   │   ├── main.jsx                    # Application entry point
│   │   └── index.css                   # Design tokens & styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── Patient.js                  # Task 5: Patient schema with enum blood group
│   │   ├── Doctor.js                   # Task 5: Doctor schema
│   │   └── Appointment.js              # Task 5: Appointment schema with references & limits
│   ├── middlewares/
│   │   ├── logger.js                   # Task 3: Format [METHOD] [PATH] [TIMESTAMP]
│   │   └── errorHandler.js             # Task 3 & 5: Structured JSON error response
│   ├── server.js                       # Express REST server & endpoints
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Environment Variables
Create a `.env` file in the root and/or `backend/` directory using the provided `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medicare_hospital
```

---

## 4. Backend Setup & Run Command

### Step 1: Navigate to backend folder and install dependencies
```bash
cd backend
npm install
```

### Step 2: Start the backend server
```bash
# Using node directly
node server.js

# OR using npm start
npm start
```
*The server will run on `http://localhost:5000`.*

---

## 5. Frontend Setup & Run Command

### Step 1: Navigate to frontend folder and install dependencies
```bash
cd frontend
npm install
```

### Step 2: Start the development server
```bash
npm run dev
```
*The React application will be accessible at `http://localhost:5173/`.*

---

## 6. MongoDB Setup

1. Ensure **MongoDB Community Server** is installed and running locally on port `27017` (or provide a cloud MongoDB Atlas URI in `.env`).
2. The application automatically connects to the database via Mongoose on startup.
3. If MongoDB is temporarily unavailable, the Express backend automatically falls back to safe in-memory data structures so the frontend continues to operate without interruption.

---

## 7. Tasks Summary & API Reference

### Task 1 — React Component Architecture
- Reusable `AppointmentCard` component (`src/components/AppointmentCard.jsx`) accepting props:
  - `patientName`, `doctorName`, `date`, `timeslot`, `status`, `reason`.
- Dynamic status classes/badges for `confirmed` (green), `pending` (amber), and `cancelled` (red).

### Task 2 — React Routing & State Management
- React Router DOM configured in `App.jsx` with routes:
  - `/` &rarr; `HomePage`
  - `/doctors` &rarr; `DoctorsPage`
  - `/booking` &rarr; `BookingPage`
- Navigation component (`Navbar.jsx`) links to all routes without full-page reloads.
- `BookingPage.jsx` contains controlled form inputs for Patient Name, Doctor, Date, Timeslot, Status, Reason.
- Multi-state management via `useState` with **Live Preview** updating in real time as the user inputs information.

### Task 3 — Express REST API + Middleware
- Custom Request Logger Middleware logging: `[METHOD] [PATH] [TIMESTAMP]`
- Global error handling middleware returning structured JSON responses.
- **REST Endpoints**:
  - `GET /api/v1/appointments` &rarr; Returns all appointments (HTTP 200)
  - `POST /api/v1/appointments` &rarr; Creates a new appointment (HTTP 201)
  - `GET /api/v1/doctors` &rarr; Returns all doctors (HTTP 200)

### Task 4 — REST API Consumption in React
- `DoctorsPage.jsx` fetches data asynchronously from `GET /api/v1/doctors` inside `useEffect`.
- Three distinct states maintained: `data`, `loading`, and `error`.
- Displays Doctor Name, Specialisation, Email, and Availability pill dynamically from the API response.

### Task 5 — MongoDB + Mongoose Schema Design & Validation
- **Schemas**:
  - **Patient**: `name` (required), `email` (required, unique), `phone`, `bloodGroup` (enum: `A+, A-, B+, B-, AB+, AB-, O+, O-`), `age` (number).
  - **Doctor**: `name` (required), `email`, `specialisation` (required), `available` (boolean, default: `true`).
  - **Appointment**: `patientId` (ref `Patient`), `doctorId` (ref `Doctor`), `date` (required), `timeslot` (required), `status` (enum: `pending, confirmed, cancelled`, default: `pending`), `reason` (max 100 characters).
- **Test Demonstration Endpoints**:
  - `POST /api/v1/test/seed` &rarr; Demonstrates database record creation, referencing, and Mongoose `.populate()`.
  - `POST /api/v1/test/validate-failure?type=missing_field` &rarr; Demonstrates required field validation failure.
  - `POST /api/v1/test/validate-failure?type=blood_group` &rarr; Demonstrates enum validation failure.
  - `POST /api/v1/test/validate-failure?type=status` &rarr; Demonstrates appointment status enum validation failure.
  - `POST /api/v1/test/validate-failure?type=reason_length` &rarr; Demonstrates max length (100 chars) validation failure.

---

## 8. API Verification with cURL / Postman

```bash
# 1. Fetch all doctors
curl -X GET http://localhost:5000/api/v1/doctors

# 2. Fetch all appointments
curl -X GET http://localhost:5000/api/v1/appointments

# 3. Create a new appointment
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientName":"Arjun Patel","doctorName":"Dr. Sarah Jenkins","date":"2026-08-30","timeslot":"10:00 AM","status":"confirmed","reason":"Follow-up check"}'

# 4. Run Task 5 Database Seed & Population Demo
curl -X POST http://localhost:5000/api/v1/test/seed

# 5. Run Task 5 Validation Failure Demo (Formatted JSON Error Response)
curl -X POST "http://localhost:5000/api/v1/test/validate-failure?type=missing_field"
```
