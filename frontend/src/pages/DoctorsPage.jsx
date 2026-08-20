import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Stethoscope, Mail, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * DoctorsPage Component (Task 4 Requirement)
 * Fetches doctor details from GET /api/v1/doctors asynchronously inside useEffect.
 * Maintains three states: data, loading, error.
 * Renders doctor name, specialisation, and availability directly from API response.
 */
export default function DoctorsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/doctors');
      if (!response.ok) {
        throw new Error(`Failed to fetch doctors (HTTP ${response.status})`);
      }
      const doctorList = await response.json();
      setData(doctorList);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching doctor records');
    } finally {
      setLoading(false);
    }
  };

  // Trigger API request when component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            Hospital Medical Specialists
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Meet our certified doctors and check their real-time consultation availability.
          </p>
        </div>

        <button onClick={fetchDoctors} className="btn btn-secondary" title="Refresh list from API">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* 1. Loading State */}
      {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            Loading Doctors Information...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Retrieving specialist data from Express REST API (<code>/api/v1/doctors</code>)
          </p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="error-box">
          <AlertCircle size={24} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Failed to Load Doctors</h4>
            <p style={{ fontSize: '0.9rem' }}>{error}</p>
          </div>
          <button onClick={fetchDoctors} className="btn btn-sm btn-outline" style={{ borderColor: '#be123c', color: '#be123c' }}>
            Try Again
          </button>
        </div>
      )}

      {/* 3. Success / Data Display State */}
      {!loading && !error && (
        <div className="grid-cards">
          {data.map((doctor, index) => (
            <div key={doctor._id || index} className="doctor-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="doctor-avatar">
                    <UserCheck size={26} />
                  </div>
                  
                  {/* Availability Badge */}
                  <span className={`availability-pill avail-${doctor.available}`}>
                    <span className="availability-dot"></span>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Doctor Name */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {doctor.name}
                </h3>

                {/* Specialisation */}
                <div className="doctor-specialisation">
                  <Stethoscope size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  {doctor.specialisation}
                </div>

                {/* Email if available */}
                {doctor.email && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    <Mail size={14} />
                    {doctor.email}
                  </p>
                )}
              </div>

              <div>
                <button
                  disabled={!doctor.available}
                  onClick={() => navigate('/booking', { state: { selectedDoctor: doctor.name } })}
                  className={`btn ${doctor.available ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', opacity: doctor.available ? 1 : 0.6, cursor: doctor.available ? 'pointer' : 'not-allowed' }}
                >
                  <Calendar size={16} />
                  {doctor.available ? 'Book Consultation' : 'Doctor Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
