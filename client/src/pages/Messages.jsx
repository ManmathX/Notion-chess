import React, { useState } from 'react';
import ChatPanel from '../components/ChatPanel.jsx';

const students = [
  { id: 1, name: 'Arjun Kumar', initials: 'AK', lastMsg: 'Can we review the endgame positions?', unread: 2 },
  { id: 2, name: 'Priya Sharma', initials: 'PS', lastMsg: 'Thank you for the homework tips!', unread: 0 },
  { id: 3, name: 'Ravi Patel', initials: 'RP', lastMsg: 'I practiced the rook endgames', unread: 1 },
  { id: 4, name: 'Meera Singh', initials: 'MS', lastMsg: 'When is the next tournament?', unread: 0 },
  { id: 5, name: 'Karan Desai', initials: 'KD', lastMsg: 'Got stuck on puzzle #42', unread: 0 },
];

const demoMessages = [
  { role: 'student', content: "Coach, can we go over the endgame positions from yesterday's class? I'm confused about the opposition concept.", timestamp: new Date(Date.now() - 3600000) },
  { role: 'coach', content: "Of course, Arjun! 🎯 The opposition concept is one of the most important ideas in King and Pawn endgames. Let me ask you — when two Kings face each other with one square between them, who has the advantage? The player whose turn it is, or the player who gets to wait? 🤔", timestamp: new Date(Date.now() - 3500000) },
  { role: 'student', content: "The player who gets to wait? Because the other king has to move?", timestamp: new Date(Date.now() - 3400000) },
  { role: 'coach', content: "Exactly right! 🎉 The player who does NOT have to move has the **opposition**. The opponent is forced to step aside, which can let your King advance. Think of it like a staring contest — the one who blinks first loses! 👀\n\nNow here's the key question: In a King + Pawn vs King endgame, when should you try to get the opposition?", timestamp: new Date(Date.now() - 3300000) },
];

const Messages = () => {
  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [messages, setMessages] = useState(demoMessages);

  const handleSendMessage = (content) => {
    const newMsg = { role: 'student', content, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    
    // Simulate coach response after a delay
    setTimeout(() => {
      const responses = [
        "Great question! Let's think about this together. What happens if the attacking King is directly in front of the pawn? 🤔",
        "That's a really good observation, Arjun! 💡 Try this: set up a position with your King on e5 and a pawn on e4 vs the opponent's King on e7. Who has the opposition?",
        "Excellent progress! 🎉 You're starting to see the pattern. Remember: the KEY rule is — if you can get your King in FRONT of your pawn with the opposition, you win the endgame!"
      ];
      const resp = { 
        role: 'coach', 
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, resp]);
    }, 1500);
  };

  return (
    <div className="messages-page">
      {/* Student List */}
      <div className="student-list">
        <div className="student-list-header">Students</div>
        <div className="student-list-items">
          {students.map(student => (
            <button
              key={student.id}
              className={`student-item ${activeStudent.id === student.id ? 'active' : ''}`}
              onClick={() => setActiveStudent(student)}
            >
              <div className="student-item-avatar">{student.initials}</div>
              <div className="student-item-info">
                <div className="student-item-name">{student.name}</div>
                <div className="student-item-last-msg">{student.lastMsg}</div>
              </div>
              {student.unread > 0 && (
                <span className="student-item-badge">{student.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={false}
        blunderData={{}} // Enable input for messages page
      />
    </div>
  );
};

export default Messages;
