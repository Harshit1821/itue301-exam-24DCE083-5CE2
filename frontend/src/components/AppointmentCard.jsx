import React from 'react';
import { Calendar, Clock, User, Stethoscope, CheckCircle2, Clock3, XCircle } from 'lucide-react';

/**
 * AppointmentCard Component (Task 1 Requirement)
 * Accepts props: patientName, doctorName, date, timeslot, status, (and optional reason)
 * Dynamically changes badge styling based on status value (confirmed, pending, cancelled).
 */
export default function AppointmentCard({
  patientName,
  doctorName,
  date,
  timeslot,
  status = 'pending',
  reason,
}) {
  const normalizedStatus = (status || 'pending').toLowerCase();

  // Helper for status icon
  const renderStatusIcon = () => {
    switch (normalizedStatus) {
      case 'confirmed':
        return <CheckCircle2 size={14} />;
      case 'cancelled':
        return <XCircle size={14} />;
      case 'pending':
      default:
        return <Clock3 size={14} />;
    }
  };

  return (
    <div className="appointment-card">
      <div className="card-header">
        <div className="patient-info">
          <h3>{patientName || 'Patient Name Not Set'}</h3>
          <div className="doctor-subtitle">
            <Stethoscope size={14} />
            <span>{doctorName || 'Doctor Not Assigned'}</span>
          </div>
        </div>

        <span className={`status-badge status-${normalizedStatus}`}>
          {renderStatusIcon()}
          {normalizedStatus}
        </span>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <Calendar size={15} />
          <span>{date || 'Date TBD'}</span>
        </div>
        <div className="detail-item">
          <Clock size={15} />
          <span>{timeslot || 'Slot TBD'}</span>
        </div>
      </div>

      {reason && (
        <div className="card-reason">
          "{reason}"
        </div>
      )}
    </div>
  );
}
