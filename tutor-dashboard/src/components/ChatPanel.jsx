import React, { useState, useRef, useEffect } from 'react';

const ChatPanel = ({ messages, onSendMessage, isLoading, blunderData }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (text) => {
    // Simple markdown-lite: **bold**, move notation highlighting
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-avatar">🤖</div>
        <div className="chat-header-info">
          <h4>Socratic Coach</h4>
          <p>AI-powered chess analysis</p>
        </div>
        <div className="chat-header-status">Online</div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && !blunderData ? (
          <div className="chat-welcome">
            <div className="welcome-emoji">♟️</div>
            <h4>Socratic Chess Coach</h4>
            <p>Upload a PGN and analyze it to start your interactive coaching session. I'll guide you through each critical moment!</p>
          </div>
        ) : messages.length === 0 && blunderData ? (
          <div className="chat-welcome">
            <div className="welcome-emoji">🔍</div>
            <h4>Let's Review This Position</h4>
            <p>Click "Start Coaching" on a blunder to begin the Socratic review session.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'coach' ? '🤖' : '🎓'}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {renderMessageContent(msg.content)}
                </div>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="typing-indicator">
            <div className="message-avatar">🤖</div>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          className="chat-input"
          type="text"
          placeholder={messages.length > 0 ? "Type your answer..." : "Start a coaching session first..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={!blunderData || isLoading}
        />
        <button 
          className="chat-send-btn" 
          onClick={handleSend}
          disabled={!input.trim() || isLoading || !blunderData}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
