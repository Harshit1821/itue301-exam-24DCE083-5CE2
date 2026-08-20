import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CalendarPlus, User, Stethoscope, Calendar, Clock, FileText, CheckCircle2, Eye, ListOrdered } from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';

/**
 * BookingPage Component (Task 2 Requirement)
 * - Controlled appointment booking form with Patient Name, Doctor Name, Date, Timeslot, Reason.
 * - Multiple meaningful state variables:
 *    1. `formData` (controlled state for patient, doctor, date, timeslot, reason)
 *    2. `selectedDoctor` (active doctor selection/preset from navigation state)
 *    3. `statusState` (status of the appointment e.g., 'pending', 'confirmed')
 *    4. `bookedList` (list of appointments booked during session)
 *    5. `submitMessage` (submission feedback banner)
 * - Displays live preview of patient name and appointment details dynamically as state changes.
 */
export default function BookingPage() {
  const location = useLocation();

  // State 1: Form Data
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: location.state?.selectedDoctor || '',
    date: new Date().toISOString().split('T')[0],
    timeslot: '10:00 AM',
    reason: '',
  });

  // State 2: Selected Doctor quick tracker & Doctor options
  const [doctorOptions, setDoctorOptions] = useState([
    'Dr. Sarah Jenkins (Cardiology)',
    'Dr. Rajesh Sharma (Neurology)',
    'Dr. Emily Chen (Pediatrics)',
    'Dr. Michael Patel (Orthopedics)',
    'Dr. Aisha Khan (Dermatology)',
  ]);

  // State 3: Selected status
  const [appointmentStatus, setAppointmentStatus] = useState('pending');

  // State 4: Booked list for the session
  const [bookedList, setBookedList] = useState([]);

  // State 5: Feedback & loading message
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live doctor list if available from API
  useEffect(() => {
    fetch('/api/v1/doctors')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) {
          setDoctorOptions(data.map((d) => `${d.name} (${d.specialisation})`));
          if (!formData.doctorName && data[0]) {
            setFormData((prev) => ({ ...prev, doctorName: `${data[0].name} (${data[0].specialisation})` }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.doctorName || !formData.date || !formData.timeslot) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const payload = {
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      date: formData.date,
      timeslot: formData.timeslot,
      status: appointmentStatus,
      reason: formData.reason,
    };

    try {
      const res = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }

      setSubmitMessage({
        type: 'success',
        text: `Appointment for "${formData.patientName}" has been successfully booked!`,
      });

      // Add to booked list state
      setBookedList((prev) => [data, ...prev]);

      // Reset form
      setFormData((prev) => ({
        ...prev,
        patientName: '',
        reason: '',
      }));
    } catch (err) {
      setSubmitMessage({
        type: 'error',
        text: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          Book a Medical Appointment
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Fill in the details below to schedule your consultation. Form preview updates in real-time.
        </p>
      </div>

      {submitMessage && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            background: submitMessage.type === 'success' ? '#ecfdf5' : '#fff1f2',
            border: `1px solid ${submitMessage.type === 'success' ? '#a7f3d0' : '#fecdd3'}`,
            color: submitMessage.type === 'success' ? '#047857' : '#be123c',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CheckCircle2 size={20} />
          <strong>{submitMessage.text}</strong>
        </div>
      )}

      <div className="booking-layout">
        {/* Form Column */}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {/* 1. Patient Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="patientName">
                Patient Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="patientName"
                type="text"
                name="patientName"
                required
                placeholder="e.g. Johnathan Smith"
                className="form-input"
                value={formData.patientName}
                onChange={handleChange}
              />
            </div>

            {/* 2. Doctor Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="doctorName">
                Select Doctor / Specialist <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="doctorName"
                name="doctorName"
                className="form-select"
                value={formData.doctorName}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a Specialist --</option>
                {doctorOptions.map((doc, idx) => (
                  <option key={idx} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Date & Time Slot Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="date">
                  Appointment Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  className="form-input"
                  required
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="timeslot">
                  Time Slot <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="timeslot"
                  name="timeslot"
                  className="form-select"
                  value={formData.timeslot}
                  onChange={handleChange}
                  required
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
            </div>

            {/* 4. Status Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Initial Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={appointmentStatus}
                onChange={(e) => setAppointmentStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* 5. Consultation Reason */}
            <div className="form-group">
              <label className="form-label" htmlFor="reason">
                Reason for Consultation <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Max 100 characters)</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows="2"
                maxLength={100}
                placeholder="Brief reason for appointment..."
                className="form-textarea"
                value={formData.reason}
                onChange={handleChange}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.25rem' }}>
                {formData.reason.length} / 100 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <CalendarPlus size={18} />
              {isSubmitting ? 'Booking Appointment...' : 'Submit Appointment Booking'}
            </button>
          </form>
        </div>

        {/* Live State Feedback & Preview Column (Task 2 Requirement) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="preview-panel">
            <div className="preview-title">
              <Eye size={16} />
              Live State Feedback & Preview
            </div>

            {/* Displaying state values meaningfully */}
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '0.35rem' }}>
                <strong>Live Patient Name State:</strong>{' '}
                <span style={{ color: formData.patientName ? 'var(--primary)' : '#94a3b8', fontWeight: 600 }}>
                  {formData.patientName || '(Waiting for input...)'}
                </span>
              </div>
              <div style={{ marginBottom: '0.35rem' }}>
                <strong>Selected Doctor State:</strong>{' '}
                <span style={{ color: formData.doctorName ? 'var(--secondary)' : '#94a3b8', fontWeight: 600 }}>
                  {formData.doctorName || '(None selected)'}
                </span>
              </div>
              <div>
                <strong>Selected Status State:</strong>{' '}
                <span className={`status-badge status-${appointmentStatus}`} style={{ marginLeft: '0.35rem' }}>
                  {appointmentStatus}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Below is the dynamic rendering of the <code>AppointmentCard</code> based on your active state:
            </p>

            {/* Render AppointmentCard preview with props */}
            <AppointmentCard
              patientName={formData.patientName || 'Preview Patient'}
              doctorName={formData.doctorName || 'Selected Doctor'}
              date={formData.date}
              timeslot={formData.timeslot}
              status={appointmentStatus}
              reason={formData.reason || 'Reason notes will appear here'}
            />
          </div>

          {/* Session Booked Appointments */}
          {bookedList.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ListOrdered size={18} />
                Just Booked in this Session ({bookedList.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bookedList.map((item, idx) => (
                  <AppointmentCard
                    key={item._id || idx}
                    patientName={item.patientName}
                    doctorName={item.doctorName}
                    date={item.date}
                    timeslot={item.timeslot}
                    status={item.status}
                    reason={item.reason}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
