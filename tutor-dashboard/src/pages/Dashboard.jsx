import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const classes = [
    { id: 1, name: 'Opening Tactics — Beginner', status: 'live', slot: 'Sat 10:00 AM', type: 'Group', students: 8, action: 'Join Class' },
    { id: 2, name: 'Endgame Strategy — Intermediate', status: 'upcoming', slot: 'Sat 12:00 PM', type: 'Group', students: 6, action: 'Join Class' },
    { id: 3, name: 'Arjun Kumar — 1-on-1', status: 'upcoming', slot: 'Sat 2:00 PM', type: '1-on-1', students: 1, action: 'Join Class' },
    { id: 4, name: 'Puzzle Rush Challenge', status: 'completed', slot: 'Fri 4:00 PM', type: 'Group', students: 12, action: 'Quick Recap' },
    { id: 5, name: 'Rook Endgames Masterclass', status: 'completed', slot: 'Thu 10:00 AM', type: 'Group', students: 5, action: 'Quick Recap' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, Satyam Nayak! 👋</h2>
          <p>{today}</p>
        </div>
        <div className="welcome-illustration">
          <div className="knight-piece">♞</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid animate-stagger">
        <div className="stat-card" onClick={() => {}}>
          <div className="stat-card-header">
            <div className="stat-card-icon purple">⏱</div>
          </div>
          <div className="stat-card-value">15 mins</div>
          <div className="stat-card-label">Next class in</div>
          <div className="stat-card-action">View schedule →</div>
        </div>

        <div className="stat-card" onClick={() => {}}>
          <div className="stat-card-header">
            <div className="stat-card-icon gold">📝</div>
          </div>
          <div className="stat-card-value">3</div>
          <div className="stat-card-label">Assignments to grade</div>
          <div className="stat-card-action">Grade now →</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/messages')}>
          <div className="stat-card-header">
            <div className="stat-card-icon blue">💬</div>
          </div>
          <div className="stat-card-value">2</div>
          <div className="stat-card-label">New messages</div>
          <div className="stat-card-action">View messages →</div>
        </div>
      </div>

      {/* Class List */}
      <div className="section-header">
        <h3 className="section-title">Today's Classes</h3>
        <div className="section-filter">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Live</button>
          <button className="filter-btn">Upcoming</button>
          <button className="filter-btn">Completed</button>
        </div>
      </div>

      <table className="class-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Slot</th>
            <th>Type</th>
            <th>Students</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls.id}>
              <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cls.name}</td>
              <td>
                <span className={`status-badge ${cls.status}`}>
                  {cls.status}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{cls.slot}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{cls.type}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{cls.students}</td>
              <td>
                {cls.status === 'completed' ? (
                  <button className="btn-quick-recap">{cls.action}</button>
                ) : cls.status === 'live' ? (
                  <button className="btn btn-primary btn-sm">{cls.action}</button>
                ) : (
                  <button className="btn btn-secondary btn-sm">{cls.action}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
