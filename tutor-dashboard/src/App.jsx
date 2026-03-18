import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import './styles/tutor-dashboard.css';

const dashboardRows = [
  {
    name: 'Satyam-WFH3.30AM',
    subtitle: 'Beginners - Opening Tactics',
    status: 'completed',
    slot: '03.30 AM - 04.30 AM',
    type: 'Batch',
    students: 4,
    action: 'Quick Recap'
  },
  {
    name: 'Demo-Morning-Slot',
    subtitle: 'Assessment Class',
    status: 'completed',
    slot: '04.30 AM - 05.30 AM',
    type: 'Demo',
    students: 1,
    action: 'Send Follow-up'
  },
  {
    name: 'Satyam-WF5.30AM',
    subtitle: 'Advanced - Endgame Strategy',
    status: 'upcoming',
    slot: '05.30 AM - 06.30 AM',
    type: 'Batch',
    students: 5,
    action: 'Start'
  },
  {
    name: 'Satyam-WF6.30AM',
    subtitle: 'Knight Tour Challenge',
    status: 'live',
    slot: '06.30 AM - 07.30 AM',
    type: 'Group',
    students: 6,
    action: 'Join'
  }
];

const studentRows = [
  { name: 'Arjun Kumar', level: 'Intermediate', focus: 'Rook endgames', progress: 82, nextClass: 'Today, 5:30 PM' },
  { name: 'Priya Sharma', level: 'Advanced', focus: 'Calculation speed', progress: 76, nextClass: 'Wed, 7:00 PM' },
  { name: 'Meera Singh', level: 'Beginner', focus: 'Board vision', progress: 68, nextClass: 'Thu, 4:00 PM' },
  { name: 'Ravi Patel', level: 'Tournament', focus: 'Opening prep', progress: 91, nextClass: 'Fri, 6:15 PM' }
];

const batchCards = [
  { title: 'Morning Foundations', students: 8, schedule: 'Mon / Wed / Fri', time: '5:30 AM', theme: 'Openings and board vision' },
  { title: 'Elite Private Track', students: 2, schedule: 'Tue / Thu', time: '7:00 PM', theme: 'Deep calculation and tournament prep' },
  { title: 'Weekend Strategy Club', students: 10, schedule: 'Saturday', time: '10:00 AM', theme: 'Middle game structures and tactics' },
  { title: 'School Squad Batch', students: 14, schedule: 'Sunday', time: '4:30 PM', theme: 'Olympiad-style practice and review' }
];

const initialThreads = [
  {
    id: 'arjun',
    batch: 'Satyam-WFH3.30AM',
    student: 'Arjun Kumar',
    initials: 'A',
    participants: '2 students',
    preview: 'Thanks for the endgame lesson...',
    time: '10:45 AM',
    unread: 2,
    messages: [
      { sender: 'student', name: 'Arjun Kumar', text: "Hi Coach, I've been practicing the endgame positions you shared.", time: '10:30 AM' },
      { sender: 'coach', name: 'You', text: "That's great to hear! How are you finding the rook endgames?", time: '10:35 AM' },
      { sender: 'student', name: 'Arjun Kumar', text: "They're challenging but I'm starting to see the patterns. The opposition concept is becoming clearer.", time: '10:40 AM' }
    ]
  },
  {
    id: 'priya',
    batch: 'Satyam-WFH3.30AM',
    student: 'Priya Sharma',
    initials: 'P',
    participants: '2 students',
    preview: 'Can we review my last game?',
    time: 'Yesterday',
    unread: 1,
    messages: [
      { sender: 'student', name: 'Priya Sharma', text: 'Can we review my last rapid game before the next class?', time: 'Yesterday' }
    ]
  },
  {
    id: 'ravi',
    batch: 'Satyam-WF5.30AM',
    student: 'Ravi Patel',
    initials: 'R',
    participants: '5 students',
    preview: 'Opening file uploaded.',
    time: 'Monday',
    unread: 0,
    messages: [
      { sender: 'student', name: 'Ravi Patel', text: 'I uploaded the Sicilian notes for tomorrow.', time: 'Monday' }
    ]
  }
];

const liveSessions = [
  {
    id: 1,
    status: 'active',
    date: '14 Mar',
    time: '05:00 PM',
    title: 'Sadhana & Kathir - Private',
    meta: '2 students · Coach Satyam · 60 min',
    tag: 'Individual'
  },
  {
    id: 2,
    status: 'upcoming',
    date: '15 Mar',
    time: '07:30 PM',
    title: 'Opening Lab - Weekend Batch',
    meta: '6 students · Coach Satyam · 75 min',
    tag: 'Group'
  },
  {
    id: 3,
    status: 'completed',
    date: '13 Mar',
    time: '04:00 PM',
    title: 'Tournament Review Circle',
    meta: '10 students · Coach Satyam · 90 min',
    tag: 'Review'
  }
];

const quizDecks = [
  {
    title: 'Opening Tactics Check',
    count: '18 questions',
    difficulty: 'Intermediate',
    detail: 'Pins, forks, skewers, and early development traps.'
  },
  {
    title: 'Endgame Essentials',
    count: '12 questions',
    difficulty: 'Beginner',
    detail: 'Opposition, king activity, and pawn races.'
  },
  {
    title: 'Tournament Prep Quiz',
    count: '22 questions',
    difficulty: 'Advanced',
    detail: 'Candidate moves, calculation depth, and time pressure choices.'
  }
];

const assignments = [
  {
    title: 'Annotated Master Game',
    due: 'Due tonight',
    summary: 'Students explain each critical move from a classical game in their own words.'
  },
  {
    title: 'Puzzle Sprint Reflection',
    due: 'Due tomorrow',
    summary: 'Players record how they found tactical motifs and where calculation broke down.'
  },
  {
    title: 'Opening Repertoire Update',
    due: 'Due Friday',
    summary: 'Each student submits one improved line and the reason it fits their style.'
  }
];

const homeworkRows = [
  { student: 'Arjun Kumar', batch: 'Morning Foundations', task: 'Rook endgames workbook', status: 'submitted', score: '9/10' },
  { student: 'Priya Sharma', batch: 'Elite Private Track', task: 'Annotated attack puzzle set', status: 'review', score: 'Pending' },
  { student: 'Meera Singh', batch: 'Weekend Strategy Club', task: 'Piece coordination warm-up', status: 'pending', score: 'Waiting' }
];

const recordings = [
  { title: 'Morning Foundations Replay', duration: '52 min', topic: 'Piece safety and development', date: 'March 16' },
  { title: 'Elite Private Session', duration: '64 min', topic: 'Converting better endgames', date: 'March 15' },
  { title: 'Weekend Strategy Club', duration: '73 min', topic: 'Pawn structures and planning', date: 'March 12' }
];

const notationRows = [
  ['1.', 'e4', 'e5'],
  ['2.', 'Nf3', 'Nc6'],
  ['3.', 'Bb5', 'a6'],
  ['4.', 'Ba4', 'Nf6'],
  ['5.', 'O-O', 'Be7'],
  ['6.', 'Re1', 'b5'],
  ['7.', 'Bb3', 'd6']
];

const pageLabels = {
  dashboard: 'Dashboard',
  students: 'Students',
  batches: 'Batches',
  messages: 'Messages',
  live: 'Live Class',
  analysis: 'Self Analysis Board',
  quiz: 'Quiz',
  assignment: 'Assignments',
  homework: 'Homework',
  recordings: 'Recordings'
};

function Icon({ name }) {
  const props = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.9',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" {...props} />
          <rect x="14" y="3" width="7" height="7" rx="1.5" {...props} />
          <rect x="3" y="14" width="7" height="7" rx="1.5" {...props} />
          <rect x="14" y="14" width="7" height="7" rx="1.5" {...props} />
        </svg>
      );
    case 'students':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" {...props} />
          <circle cx="10" cy="8" r="3" {...props} />
          <path d="M21 21v-2a4 4 0 0 0-3-3.85" {...props} />
          <path d="M15 5.15A3 3 0 0 1 18 8a3 3 0 0 1-3 2.85" {...props} />
        </svg>
      );
    case 'batches':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 3 8l9 5 9-5-9-5Z" {...props} />
          <path d="m3 12 9 5 9-5" {...props} />
          <path d="m3 16 9 5 9-5" {...props} />
        </svg>
      );
    case 'messages':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...props} />
        </svg>
      );
    case 'live':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="6" width="14" height="12" rx="2" {...props} />
          <path d="m16 10 5-3v10l-5-3" {...props} />
        </svg>
      );
    case 'analysis':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19h16" {...props} />
          <path d="M7 16V8l5-4 5 4v8" {...props} />
          <path d="M9 16v-3h6v3" {...props} />
        </svg>
      );
    case 'clipboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="9" y="2" width="6" height="4" rx="1" {...props} />
          <path d="M8 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" {...props} />
          <path d="M9 12h6" {...props} />
          <path d="M9 16h4" {...props} />
        </svg>
      );
    case 'quiz':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 9a3 3 0 1 1 5.2 2.1c-.8.8-1.2 1.3-1.2 2.4" {...props} />
          <path d="M12 17h.01" {...props} />
          <circle cx="12" cy="12" r="9" {...props} />
        </svg>
      );
    case 'assignment':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" {...props} />
          <path d="M14 2v6h6" {...props} />
          <path d="M9 13h6" {...props} />
          <path d="M9 17h4" {...props} />
        </svg>
      );
    case 'homework':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3Z" {...props} />
          <path d="M5 4v16a3 3 0 0 1 3-3h11" {...props} />
          <path d="M9 9h6" {...props} />
          <path d="M9 13h5" {...props} />
        </svg>
      );
    case 'recordings':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...props} />
          <path d="m10 8 6 4-6 4V8Z" {...props} />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 17H5l1.4-1.4A2 2 0 0 0 7 14.2V10a5 5 0 1 1 10 0v4.2a2 2 0 0 0 .6 1.4L19 17h-4" {...props} />
          <path d="M10 20a2 2 0 0 0 4 0" {...props} />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" {...props} />
          <path d="m20 20-3.5-3.5" {...props} />
        </svg>
      );
    case 'send':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 2 11 13" {...props} />
          <path d="m22 2-7 20-4-9-9-4 20-7Z" {...props} />
        </svg>
      );
    case 'chevron':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" {...props} />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" {...props} />
          <path d="M16 3v4" {...props} />
          <path d="M8 3v4" {...props} />
          <path d="M3 10h18" {...props} />
        </svg>
      );
    case 'filter':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16" {...props} />
          <path d="M7 12h10" {...props} />
          <path d="M10 18h4" {...props} />
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...props} />
          <path d="M12 7v5l3 2" {...props} />
        </svg>
      );
    case 'save':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h12l2 2v14H5z" {...props} />
          <path d="M8 4v6h8V4" {...props} />
        </svg>
      );
    case 'puzzle':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 5a2 2 0 1 1 4 0h3a2 2 0 0 1 2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 1-2 2h-3a2 2 0 1 1-4 0H7a2 2 0 0 1-2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 1 2-2z" {...props} />
        </svg>
      );
    case 'download':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v12" {...props} />
          <path d="m7 10 5 5 5-5" {...props} />
          <path d="M5 21h14" {...props} />
        </svg>
      );
    case 'trash':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18" {...props} />
          <path d="M8 6V4h8v2" {...props} />
          <path d="m19 6-1 14H6L5 6" {...props} />
        </svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" {...props} />
          <path d="m4 7 8 6 8-6" {...props} />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...props} />
          <path d="m10 8 6 4-6 4V8Z" {...props} />
        </svg>
      );
    default:
      return null;
  }
}

function PageBanner({ title, subtitle, kicker, action, icon = 'analysis' }) {
  return (
    <section className="page-banner card-shell">
      <div className="page-banner__copy">
        <div className="page-banner__icon">
          <Icon name={icon} />
        </div>
        <div>
          {kicker ? <div className="banner-kicker">{kicker}</div> : null}
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      {action ? <div className="page-banner__action">{action}</div> : null}
    </section>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{status}</span>;
}

function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="welcome-banner card-shell">
        <div className="welcome-copy">
          <div className="banner-kicker">Coach Workspace</div>
          <h1>Welcome back, Satyam Nayak!</h1>
          <p>(IST) Tuesday, March 17, 2026</p>
          <div className="metric-grid metric-grid--hero">
            <article className="metric-card">
              <div className="metric-card__icon purple">
                <Icon name="clock" />
              </div>
              <div>
                <span>Next class in</span>
                <strong>15 mins</strong>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-card__icon gold">
                <Icon name="assignment" />
              </div>
              <div>
                <span>To grade</span>
                <strong>3 Assignments</strong>
              </div>
            </article>
            <article className="metric-card">
              <div className="metric-card__icon purple">
                <Icon name="messages" />
              </div>
              <div>
                <span>New messages</span>
                <strong>2 Messages</strong>
              </div>
            </article>
          </div>
        </div>
        <div className="knight-mark">
          <span>♞</span>
        </div>
      </section>

      <section className="table-shell card-shell">
        <div className="section-header">
          <div>
            <div className="banner-kicker muted">Operations</div>
            <h2>Class Operations</h2>
          </div>
          <div className="filter-pills">
            <button type="button" className="active">All</button>
            <button type="button">Live</button>
            <button type="button">Upcoming</button>
            <button type="button">Completed</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
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
              {dashboardRows.map((row) => (
                <tr key={row.name}>
                  <td>
                    <strong>{row.name}</strong>
                    <span>{row.subtitle}</span>
                  </td>
                  <td><StatusBadge status={row.status} /></td>
                  <td>{row.slot}</td>
                  <td>{row.type}</td>
                  <td>{row.students}</td>
                  <td>
                    <button type="button" className={`row-action ${row.status}`}>
                      {row.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StudentsPage() {
  return (
    <div className="page-stack">
      <PageBanner
        icon="students"
        title="Students"
        subtitle="Manage your students, track progress, and prepare personalized next steps."
      />

      <section className="metric-grid">
        <article className="metric-card card-shell tall">
          <div className="metric-card__icon gold"><Icon name="students" /></div>
          <span>Active students</span>
          <strong>42</strong>
          <p>Across 8 batches and 6 private cohorts.</p>
        </article>
        <article className="metric-card card-shell tall">
          <div className="metric-card__icon purple"><Icon name="dashboard" /></div>
          <span>Attendance rate</span>
          <strong>96%</strong>
          <p>Strong consistency over the last 30 days.</p>
        </article>
        <article className="metric-card card-shell tall">
          <div className="metric-card__icon gold"><Icon name="analysis" /></div>
          <span>Average ELO gain</span>
          <strong>+182</strong>
          <p>Measured for tournament students over one term.</p>
        </article>
      </section>

      <section className="student-grid">
        {studentRows.map((student) => (
          <article key={student.name} className="student-card card-shell">
            <div className="student-card__header">
              <div>
                <h3>{student.name}</h3>
                <p>{student.level}</p>
              </div>
              <span className="progress-pill">{student.progress}%</span>
            </div>
            <dl>
              <div>
                <dt>Focus area</dt>
                <dd>{student.focus}</dd>
              </div>
              <div>
                <dt>Next class</dt>
                <dd>{student.nextClass}</dd>
              </div>
            </dl>
            <div className="progress-bar">
              <span style={{ width: `${student.progress}%` }}></span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function BatchesPage() {
  return (
    <div className="page-stack">
      <PageBanner
        icon="batches"
        title="Batches"
        subtitle="View and manage all batches with schedules, learning themes, and engagement health."
      />
      <section className="card-grid">
        {batchCards.map((batch) => (
          <article key={batch.title} className="info-card card-shell">
            <div className="info-card__top">
              <div className="info-icon"><Icon name="batches" /></div>
              <span className="tag-chip">{batch.students} students</span>
            </div>
            <h3>{batch.title}</h3>
            <p>{batch.theme}</p>
            <dl>
              <div>
                <dt>Schedule</dt>
                <dd>{batch.schedule}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{batch.time}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}

function MessagesPage({
  threads,
  activeThread,
  activeThreadId,
  onSelectThread,
  messageDraft,
  setMessageDraft,
  onSendMessage,
  broadcastMode,
  setBroadcastMode
}) {
  return (
    <div className="page-stack">
      <section className="messages-layout">
        <aside className="messages-sidebar card-shell">
          <div className="search-field">
            <Icon name="search" />
            <input type="text" value="Search students..." readOnly />
          </div>

          <div className="thread-group">
            {threads.map((thread) => (
              <button
                type="button"
                key={thread.id}
                className={`thread-item ${thread.id === activeThreadId ? 'active' : ''}`}
                onClick={() => onSelectThread(thread.id)}
              >
                <div className="thread-avatar">{thread.initials}</div>
                <div className="thread-copy">
                  <strong>{thread.student}</strong>
                  <span>{thread.preview}</span>
                  <small>{thread.time}</small>
                </div>
                {thread.unread ? <span className="thread-badge">{thread.unread}</span> : null}
              </button>
            ))}
          </div>
        </aside>

        <section className="messages-panel card-shell">
          <div className="messages-panel__header">
            <div>
              <h2>{activeThread.student}</h2>
              <p>{activeThread.batch} · {activeThread.participants}</p>
            </div>
            <label className="toggle-row">
              <span className={`toggle ${broadcastMode ? 'on' : ''}`}>
                <input
                  type="checkbox"
                  checked={broadcastMode}
                  onChange={(event) => setBroadcastMode(event.target.checked)}
                />
                <span></span>
              </span>
              <div>
                <strong>Broadcast to Batch</strong>
                <p>Send message to individual student</p>
              </div>
            </label>
          </div>

          <div className="chat-stack">
            {activeThread.messages.map((message, index) => (
              <article key={`${message.time}-${index}`} className={`chat-bubble ${message.sender}`}>
                <strong>{message.name}</strong>
                <p>{message.text}</p>
                <small>{message.time}</small>
              </article>
            ))}
          </div>

          <div className="composer-row">
            <button type="button" className="icon-button subtle">
              <Icon name="assignment" />
            </button>
            <textarea
              value={messageDraft}
              onChange={(event) => setMessageDraft(event.target.value)}
              placeholder="Type your message..."
            />
            <button type="button" className="icon-button send" onClick={onSendMessage}>
              <Icon name="send" />
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}

function LiveClassPage({ classFilter, setClassFilter }) {
  const filters = ['active', 'upcoming', 'completed'];
  const filteredSessions = liveSessions.filter((session) => session.status === classFilter);

  return (
    <div className="page-stack">
      <PageBanner
        icon="live"
        title="Live Class Command Center"
        subtitle="Manage sessions, track analytics, and monitor student engagement."
      />

      <section className="metric-grid">
        <article className="metric-card card-shell tall">
          <div className="metric-card__icon purple"><Icon name="live" /></div>
          <span>Total classes</span>
          <strong>6</strong>
          <p>2 individual and 4 group sessions this week.</p>
        </article>
        <article className="metric-card card-shell tall">
          <div className="metric-card__icon gold"><Icon name="clock" /></div>
          <span>Total duration</span>
          <strong>6h 0m</strong>
          <p>Average per session: 60 minutes.</p>
        </article>
        <article className="metric-card card-shell tall">
          <div className="metric-card__icon purple"><Icon name="students" /></div>
          <span>Active students</span>
          <strong>22</strong>
          <p>Strong attendance and repeat engagement.</p>
        </article>
      </section>

      <section className="card-shell">
        <div className="toolbar-row">
          <div className="tab-pills">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={classFilter === filter ? 'active' : ''}
                onClick={() => setClassFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="toolbar-actions">
            <button type="button" className="ghost-button">
              <Icon name="calendar" />
              Date Range
            </button>
            <button type="button" className="ghost-button">
              <Icon name="filter" />
              All Batches
            </button>
          </div>
        </div>

        <div className="session-list">
          {filteredSessions.map((session) => (
            <article key={session.id} className="session-card">
              <div className="session-date">
                <strong>{session.date}</strong>
                <span>{session.time}</span>
              </div>
              <div className="session-copy">
                <h3>{session.title}</h3>
                <p>{session.meta}</p>
              </div>
              <span className="tag-chip">{session.tag}</span>
              <button type="button" className="join-button">
                <Icon name="live" />
                {session.status === 'completed' ? 'Review' : 'Join'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AnalysisPage({ analysisTab, setAnalysisTab }) {
  const analysisTabs = ['notation', 'engine', 'coach'];

  return (
    <div className="page-stack">
      <PageBanner
        icon="analysis"
        title="Self Analysis Board"
        subtitle="Deep tactical analysis and position study for private lessons and batch follow-ups."
        action={
          <button type="button" className="accent-outline">
            Aesthetics Studio
          </button>
        }
      />

      <section className="analysis-layout">
        <div className="analysis-board-shell card-shell">
          <div className="analysis-board-wrap">
            <Chessboard
              id="tutor-analysis-board"
              position="start"
              boardWidth={620}
              arePiecesDraggable={false}
              customDarkSquareStyle={{ backgroundColor: '#464646' }}
              customLightSquareStyle={{ backgroundColor: '#d9d9d9' }}
              customBoardStyle={{ borderRadius: '24px', overflow: 'hidden' }}
            />
          </div>
        </div>

        <aside className="analysis-sidebar">
          <div className="tool-panel card-shell">
            <button type="button" className="tool-button"><Icon name="save" />Save</button>
            <button type="button" className="tool-button"><Icon name="puzzle" />Puzzle</button>
            <button type="button" className="tool-button"><Icon name="download" />Export</button>
            <button type="button" className="tool-button"><Icon name="trash" />Clear</button>
            <button type="button" className="tool-button wide"><Icon name="assignment" />Paste PGN</button>
          </div>

          <div className="notation-panel card-shell">
            <div className="notation-tabs">
              {analysisTabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={analysisTab === tab ? 'active' : ''}
                  onClick={() => setAnalysisTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {analysisTab === 'notation' ? (
              <div className="notation-list">
                {notationRows.map((move) => (
                  <div key={move[0]} className="notation-row">
                    <span>{move[0]}</span>
                    <button type="button">{move[1]}</button>
                    <button type="button">{move[2]}</button>
                  </div>
                ))}
              </div>
            ) : null}

            {analysisTab === 'engine' ? (
              <div className="insight-stack">
                <article>
                  <strong>Engine verdict</strong>
                  <p>White is slightly better with more active pieces and safer king placement.</p>
                </article>
                <article>
                  <strong>Coach note</strong>
                  <p>Ask the student why 5. O-O improves flexibility compared to grabbing material.</p>
                </article>
              </div>
            ) : null}

            {analysisTab === 'coach' ? (
              <div className="insight-stack">
                <article>
                  <strong>Lesson prompt</strong>
                  <p>Which move would you consider if Black delays castling? Find checks, captures, and threats.</p>
                </article>
                <article>
                  <strong>Homework idea</strong>
                  <p>Replay the first 10 moves and narrate the purpose of each developing move aloud.</p>
                </article>
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </div>
  );
}

function QuizPage() {
  return (
    <div className="page-stack">
      <PageBanner
        icon="quiz"
        title="Quiz"
        subtitle="Create and manage quizzes for students, batch reviews, and revision cycles."
      />
      <section className="two-column">
        <div className="card-grid">
          {quizDecks.map((quiz) => (
            <article key={quiz.title} className="info-card card-shell">
              <div className="info-card__top">
                <div className="info-icon"><Icon name="quiz" /></div>
                <span className="tag-chip">{quiz.difficulty}</span>
              </div>
              <h3>{quiz.title}</h3>
              <p>{quiz.detail}</p>
              <strong className="muted-copy">{quiz.count}</strong>
            </article>
          ))}
        </div>

        <article className="preview-card card-shell">
          <div className="banner-kicker">Preview</div>
          <h2>Endgame Essentials</h2>
          <p>Sample prompt: In a king and pawn ending, when should you aim to take the opposition?</p>
          <div className="preview-options">
            <button type="button">When your king is more active</button>
            <button type="button">Only after promoting a pawn</button>
            <button type="button">When both kings face each other and tempo matters</button>
          </div>
        </article>
      </section>
    </div>
  );
}

function AssignmentPage() {
  return (
    <div className="page-stack">
      <PageBanner
        icon="assignment"
        title="Assignments"
        subtitle="Manage and review student assignments with faster feedback loops."
      />

      <section className="centerpiece card-shell">
        <div className="centerpiece-icon">
          <Icon name="assignment" />
        </div>
        <h2>Assignment Management</h2>
        <p>Create, assign, and track student assignments. Review submissions and provide feedback to students.</p>
      </section>

      <section className="card-grid">
        {assignments.map((item) => (
          <article key={item.title} className="info-card card-shell">
            <div className="info-card__top">
              <div className="info-icon"><Icon name="clipboard" /></div>
              <span className="tag-chip">{item.due}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function HomeworkPage() {
  return (
    <div className="page-stack">
      <PageBanner
        icon="homework"
        title="Homework"
        subtitle="Assign and review homework for students across all active chess batches."
      />

      <section className="card-grid">
        {homeworkRows.map((row) => (
          <article key={row.student} className="info-card card-shell">
            <div className="info-card__top">
              <div className="info-icon"><Icon name="homework" /></div>
              <span className={`status-badge ${row.status}`}>{row.status}</span>
            </div>
            <h3>{row.student}</h3>
            <p>{row.task}</p>
            <dl>
              <div>
                <dt>Batch</dt>
                <dd>{row.batch}</dd>
              </div>
              <div>
                <dt>Score</dt>
                <dd>{row.score}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}

function RecordingsPage() {
  return (
    <div className="page-stack">
      <PageBanner
        icon="recordings"
        title="Recordings"
        subtitle="Access all recorded class sessions and quickly resend useful lessons to students."
      />

      <section className="card-grid">
        {recordings.map((recording) => (
          <article key={recording.title} className="info-card card-shell">
            <div className="info-card__top">
              <div className="info-icon"><Icon name="play" /></div>
              <span className="tag-chip">{recording.duration}</span>
            </div>
            <h3>{recording.title}</h3>
            <p>{recording.topic}</p>
            <dl>
              <div>
                <dt>Date</dt>
                <dd>{recording.date}</dd>
              </div>
            </dl>
            <div className="button-row">
              <button type="button" className="ghost-button">Watch</button>
              <button type="button" className="ghost-button">Share</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [assessmentsOpen, setAssessmentsOpen] = useState(true);
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [messageDraft, setMessageDraft] = useState('');
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [classFilter, setClassFilter] = useState('active');
  const [analysisTab, setAnalysisTab] = useState('notation');

  const activeThread = threads.find((thread) => thread.id === activeThreadId) || threads[0];
  const assessmentPages = ['quiz', 'assignment', 'homework'];

  const selectPage = (page) => {
    setActivePage(page);
    if (assessmentPages.includes(page)) {
      setAssessmentsOpen(true);
    }
  };

  const selectThread = (threadId) => {
    setActiveThreadId(threadId);
    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === threadId ? { ...thread, unread: 0 } : thread
      )
    );
  };

  const sendMessage = () => {
    const content = messageDraft.trim();
    if (!content) {
      return;
    }

    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              preview: content,
              time: 'Now',
              unread: 0,
              messages: [
                ...thread.messages,
                {
                  sender: 'coach',
                  name: 'You',
                  text: broadcastMode ? `[Broadcast] ${content}` : content,
                  time: '10:35 AM'
                }
              ]
            }
          : thread
      )
    );

    setMessageDraft('');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'students':
        return <StudentsPage />;
      case 'batches':
        return <BatchesPage />;
      case 'messages':
        return (
          <MessagesPage
            threads={threads}
            activeThread={activeThread}
            activeThreadId={activeThreadId}
            onSelectThread={selectThread}
            messageDraft={messageDraft}
            setMessageDraft={setMessageDraft}
            onSendMessage={sendMessage}
            broadcastMode={broadcastMode}
            setBroadcastMode={setBroadcastMode}
          />
        );
      case 'live':
        return <LiveClassPage classFilter={classFilter} setClassFilter={setClassFilter} />;
      case 'analysis':
        return <AnalysisPage analysisTab={analysisTab} setAnalysisTab={setAnalysisTab} />;
      case 'quiz':
        return <QuizPage />;
      case 'assignment':
        return <AssignmentPage />;
      case 'homework':
        return <HomeworkPage />;
      case 'recordings':
        return <RecordingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="academy-app">
      <aside className="academy-sidebar">
        <div className="brand-block">
          <div className="brand-coin">NC</div>
          <div className="brand-copy">
            <strong>NOTION CHESS</strong>
            <span>ACADEMY</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-label">Operations</div>
            <button type="button" className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => selectPage('dashboard')}>
              <Icon name="dashboard" />
              <span>Dashboard</span>
            </button>
            <button type="button" className={`nav-item ${activePage === 'students' ? 'active' : ''}`} onClick={() => selectPage('students')}>
              <Icon name="students" />
              <span>Students</span>
            </button>
            <button type="button" className={`nav-item ${activePage === 'batches' ? 'active' : ''}`} onClick={() => selectPage('batches')}>
              <Icon name="batches" />
              <span>Batches</span>
            </button>
            <button type="button" className={`nav-item ${activePage === 'messages' ? 'active' : ''}`} onClick={() => selectPage('messages')}>
              <Icon name="messages" />
              <span>Messages</span>
            </button>
          </div>

          <div className="nav-group">
            <div className="nav-label">Classroom</div>
            <button type="button" className={`nav-item ${activePage === 'live' ? 'active' : ''}`} onClick={() => selectPage('live')}>
              <Icon name="live" />
              <span>Live Class</span>
            </button>
            <button type="button" className={`nav-item ${activePage === 'analysis' ? 'active' : ''}`} onClick={() => selectPage('analysis')}>
              <Icon name="analysis" />
              <span>Self Analysis Board</span>
            </button>
          </div>

          <div className="nav-group">
            <button
              type="button"
              className={`nav-toggle ${assessmentPages.includes(activePage) ? 'active' : ''}`}
              onClick={() => setAssessmentsOpen((current) => !current)}
            >
              <div className="nav-toggle__copy">
                <Icon name="clipboard" />
                <span>Assessments</span>
              </div>
              <span className={`chevron ${assessmentsOpen ? 'open' : ''}`}>
                <Icon name="chevron" />
              </span>
            </button>

            {assessmentsOpen ? (
              <div className="sub-nav">
                <button type="button" className={`nav-item ${activePage === 'quiz' ? 'active' : ''}`} onClick={() => selectPage('quiz')}>
                  <Icon name="quiz" />
                  <span>Quiz</span>
                </button>
                <button type="button" className={`nav-item ${activePage === 'assignment' ? 'active' : ''}`} onClick={() => selectPage('assignment')}>
                  <Icon name="assignment" />
                  <span>Assignment</span>
                </button>
                <button type="button" className={`nav-item ${activePage === 'homework' ? 'active' : ''}`} onClick={() => selectPage('homework')}>
                  <Icon name="homework" />
                  <span>Homework</span>
                </button>
              </div>
            ) : null}
          </div>

          <div className="nav-group">
            <div className="nav-label">Recordings</div>
            <button type="button" className={`nav-item ${activePage === 'recordings' ? 'active' : ''}`} onClick={() => selectPage('recordings')}>
              <Icon name="recordings" />
              <span>Recordings</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="academy-main">
        <header className="topbar">
          <div className="topbar-copy">
            <div className="banner-kicker muted">Tutor Dashboard</div>
            <strong>{pageLabels[activePage]}</strong>
          </div>
          <div className="topbar-actions">
            <button type="button" className="icon-button">
              <Icon name="bell" />
              <span className="notification-dot"></span>
            </button>
            <button type="button" className="profile-pill">SN</button>
          </div>
        </header>

        <main className="academy-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
