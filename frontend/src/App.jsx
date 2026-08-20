import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';

/**
 * Main App Component (Task 2 Requirement)
 * Configures React Router routes:
 * - / -> HomePage
 * - /doctors -> DoctorsPage
 * - /booking -> BookingPage
 */
export default function App() {
  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Routing */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>MediCare Plus Hospital Appointment System</strong> — ITUE301 Advanced Web Development Frameworks
          </div>
          <div>
            Built with React + Express.js + MongoDB Mongoose
          </div>
        </div>
      </footer>
    </div>
  );
}
