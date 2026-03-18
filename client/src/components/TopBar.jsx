import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/analysis': 'Self Analysis Board',
  '/messages': 'Messages'
};

const TopBar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notification-dot"></span>
        </button>
        <div className="topbar-profile">
          <div className="profile-avatar">SN</div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
