import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, UserCheck, ShieldCheck, HeartPulse, Clock, Sparkles } from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';

export default function HomePage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/appointments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch appointments');
        return res.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Using fallback initial sample data:', err.message);
        setAppointments([
          {
            _id: 'demo1',
            patientName: 'John Doe',
            doctorName: 'Dr. Sarah Jenkins',
            date: '2026-08-25',
            timeslot: '10:00 AM',
            status: 'confirmed',
            reason: 'Routine cardiovascular follow-up check',
          },
          {
            _id: 'demo2',
            patientName: 'Priya Patel',
            doctorName: 'Dr. Rajesh Sharma',
            date: '2026-08-26',
            timeslot: '11:30 AM',
            status: 'pending',
            reason: 'Migraine consultation and evaluation',
          },
          {
            _id: 'demo3',
            patientName: 'David Miller',
            doctorName: 'Dr. Michael Patel',
            date: '2026-08-27',
            timeslot: '02:00 PM',
            status: 'cancelled',
            reason: 'Knee joint ache assessment',
          },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
            <Sparkles size={16} /> MediCare Plus Hospital System
          </div>
          <h1 className="hero-title">
            Your Health, Scheduled with Ease & Precision.
          </h1>
          <p className="hero-subtitle">
            Welcome to MediCare Plus Hospital Appointment Portal. Connect with top specialists, check doctor availability in real-time, and schedule your consultations effortlessly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-primary" style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}>
              <CalendarPlus size={18} />
              Book Appointment
            </Link>
            <Link to="/doctors" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#ffffff' }}>
              <UserCheck size={18} />
              View Specialists
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '10px' }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Expert Care</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Certified specialists across departments</p>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '0.75rem', borderRadius: '10px' }}>
            <Clock size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Instant Booking</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Real-time slot reservation & confirmation</p>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.75rem', borderRadius: '10px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Secure Records</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>MongoDB & Mongoose Schema validated</p>
          </div>
        </div>
      </div>

      {/* Recent Appointments Section demonstrating AppointmentCard (Task 1) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Recent Appointments Schedule</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Overview of active and upcoming patient visits</p>
          </div>
          <Link to="/booking" className="btn btn-secondary btn-sm" style={{ fontSize: '0.85rem' }}>
            + New Booking
          </Link>
        </div>

        {loading ? (
          <div className="state-box">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading appointments schedule...</p>
          </div>
        ) : (
          <div className="grid-cards">
            {appointments.map((apt, index) => (
              <AppointmentCard
                key={apt._id || index}
                patientName={apt.patientName}
                doctorName={apt.doctorName}
                date={apt.date}
                timeslot={apt.timeslot}
                status={apt.status}
                reason={apt.reason}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
