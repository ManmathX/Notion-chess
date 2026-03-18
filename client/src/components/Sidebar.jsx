import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Collapse Toggle */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="url(#lg)" />
            <text x="20" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter">NC</text>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="logo-text">
          <span className="logo-name">Notion Chess</span>
          <span className="logo-subtitle">Academy</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-group-label">Operations</span>
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
            <span>Dashboard</span>
          </NavLink>
          <a href="#" className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <span>Students</span>
          </a>
          <a href="#" className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
            <span>Batches</span>
          </a>
          <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span>Messages</span>
            <span className="nav-badge">2</span>
          </NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-label">Classroom</span>
          <a href="#" className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
            <span>Live Class</span>
          </a>
          <NavLink to="/analysis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <span>Self Analysis Board</span>
            <span className="nav-badge new">NEW</span>
          </NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-group-label">Assessments</span>
          <a href="#" className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            <span>Quiz</span>
          </a>
          <a href="#" className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            <span>Assignment</span>
          </a>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">SN</div>
          <div className="user-info">
            <span className="user-name">Satyam Nayak</span>
            <span className="user-role">Head Coach</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
