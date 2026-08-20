import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity, Home, UserCheck, CalendarPlus } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="brand-logo">
          <span className="brand-badge">
            <Activity size={20} />
          </span>
          <span>MediCare <span style={{ color: 'var(--primary)' }}>Plus</span></span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctors"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <UserCheck size={18} />
              <span>Doctors</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/booking"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <CalendarPlus size={18} />
              <span>Book Appointment</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
