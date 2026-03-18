import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import ChatPanel from '../components/ChatPanel.jsx';
import { analyzeGame, sendChatMessage } from '../services/api.js';
import useWebSocket from '../hooks/useWebSocket.js';

// Sample PGN — Paul Morphy's "Opera Game" (well-known, valid, with tactics)
const SAMPLE_PGN = `[Event "Opera Game"]
[Site "Paris"]
[Date "1858.01.01"]
[White "Paul Morphy"]
[Black "Duke of Brunswick"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7
8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8
13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`;

const Analysis = () => {
  // PGN input
  const [pgnInput, setPgnInput] = useState('');
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  
  // Board state
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [boardPosition, setBoardPosition] = useState('start');
  
  // Blunder coaching state
  const [activeBlunder, setActiveBlunder] = useState(null);
  const [activeBlunderIndex, setActiveBlunderIndex] = useState(-1);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);

  // Load sample PGN
  const handleLoadSample = () => {
    setPgnInput(SAMPLE_PGN);
  };

  // Analyze game
  const handleAnalyze = async () => {
    const pgnToAnalyze = pgnInput.trim();
    if (!pgnToAnalyze) return;

    setIsAnalyzing(true);
    setAnalysisData(null);
    setActiveBlunder(null);
    setChatMessages([]);
    setChatSessionId(null);

    try {
      const result = await analyzeGame(pgnToAnalyze);
      setAnalysisData(result);
      setCurrentMoveIndex(0);
      setBoardPosition(result.fens[0] || 'start');
    } catch (err) {
      console.error('Analysis failed:', err);
      // Fallback: parse locally
      try {
        const chess = new Chess();
        chess.loadPgn(pgnToAnalyze);
        const history = chess.history();
        chess.reset();
        const fens = [chess.fen()];
        for (const move of history) {
          chess.move(move);
          fens.push(chess.fen());
        }
        setAnalysisData({
          moves: history,
          fens,
          evaluations: history.map(() => 0),
          blunders: [],
          totalMoves: history.length,
          blunderCount: 0
        });
        setBoardPosition(fens[0]);
        setCurrentMoveIndex(0);
      } catch (parseErr) {
        alert('Failed to parse PGN. Please check the format.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Navigate moves
  const goToMove = useCallback((index) => {
    if (!analysisData) return;
    const clampedIndex = Math.max(0, Math.min(index, analysisData.fens.length - 1));
    setCurrentMoveIndex(clampedIndex);
    setBoardPosition(analysisData.fens[clampedIndex]);
  }, [analysisData]);

  // Start coaching on a blunder
  const startCoaching = async (blunder, blunderIdx) => {
    setActiveBlunder(blunder);
    setActiveBlunderIndex(blunderIdx);
    setChatMessages([]);
    setChatSessionId(null);
    setChatLoading(true);

    // Navigate to the blunder position
    if (analysisData) {
      const moveIdx = analysisData.moves.findIndex((m, i) => {
        const moveNum = Math.floor(i / 2) + 1;
        const color = i % 2 === 0 ? 'w' : 'b';
        return moveNum === blunder.moveNumber && color === blunder.color;
      });
      if (moveIdx >= 0) {
        goToMove(moveIdx);
      }
    }

    try {
      const result = await sendChatMessage(blunder, null, null, null, blunderIdx);
      setChatSessionId(result.sessionId);
      setChatMessages(result.messages || [{ role: 'coach', content: result.response, timestamp: new Date() }]);
    } catch (err) {
      // Use fallback coaching message
      setChatMessages([{
        role: 'coach',
        content: `Hey! 👋 Let's look at this position. You played **${blunder.movePlayed}**, but there was a stronger move here!\n\n🤔 Take a close look at the board. Do you notice any pieces that are unprotected or any tactical opportunities?`,
        timestamp: new Date()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Send student message
  const handleSendMessage = async (message) => {
    if (!activeBlunder) return;
    
    // Add student message immediately
    const studentMsg = { role: 'student', content: message, timestamp: new Date() };
    setChatMessages(prev => [...prev, studentMsg]);
    setChatLoading(true);

    try {
      const result = await sendChatMessage(
        activeBlunder, 
        message, 
        chatSessionId, 
        null, 
        activeBlunderIndex
      );
      setChatSessionId(result.sessionId);
      // Add only the new coach response
      const coachMsg = { role: 'coach', content: result.response, timestamp: new Date() };
      setChatMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      const fallbackResponses = [
        "Good thinking! 🤔 Look more carefully at the diagonals and open lines. Is there a piece that could create a more aggressive threat?",
        "You're on the right track! 💡 Remember — always check for forcing moves: checks, captures, and threats before quiet moves.",
        "Almost there! ⚡ Think about what would happen if you could attack the opponent's King. Which piece could do that most effectively?",
      ];
      const coachMsg = { 
        role: 'coach', 
        content: fallbackResponses[Math.min(chatMessages.filter(m => m.role === 'coach').length, fallbackResponses.length - 1)],
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, coachMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Get eval bar width
  const getEvalBarWidth = () => {
    if (!analysisData || !analysisData.evaluations[currentMoveIndex]) return 50;
    const eval_ = analysisData.evaluations[currentMoveIndex];
    // Clamp eval to -5 to +5 range and map to 0-100%
    const clamped = Math.max(-5, Math.min(5, eval_));
    return 50 + (clamped / 5) * 50;
  };

  const getEvalText = () => {
    if (!analysisData || analysisData.evaluations[currentMoveIndex] === undefined) return '0.0';
    const eval_ = analysisData.evaluations[currentMoveIndex];
    return (eval_ > 0 ? '+' : '') + eval_.toFixed(1);
  };

  // Check if a move is a blunder
  const isBlunderMove = (moveIndex) => {
    if (!analysisData || !analysisData.blunders) return false;
    const moveNum = Math.floor(moveIndex / 2) + 1;
    const color = moveIndex % 2 === 0 ? 'w' : 'b';
    return analysisData.blunders.some(b => b.moveNumber === moveNum && b.color === color);
  };

  return (
    <div className="analysis-page">
      {/* PGN Upload Section */}
      <div className="pgn-upload-section">
        <h3>📋 Upload Game (PGN)</h3>
        <p className="subtitle">Paste your game's PGN notation below, then click analyze to start your Socratic coaching session.</p>
        <textarea
          className="pgn-textarea"
          placeholder="Paste your PGN here...&#10;&#10;Example:&#10;1. e4 e5 2. Nf3 Nc6 3. Bc4 ..."
          value={pgnInput}
          onChange={(e) => setPgnInput(e.target.value)}
          rows={5}
        />
        <div className="pgn-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleAnalyze} 
            disabled={!pgnInput.trim() || isAnalyzing}
          >
            {isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze with Socratic Coach'}
          </button>
          <button className="sample-pgn-btn" onClick={handleLoadSample}>
            📎 Load Sample Game
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="analysis-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing your game move by move...</p>
          <p className="text-muted" style={{ fontSize: '0.78rem' }}>The engine is evaluating each position for critical moments.</p>
        </div>
      )}

      {/* Analysis Board + Chat Layout */}
      {analysisData && !isAnalyzing && (
        <div className="analysis-board-layout">
          {/* Left: Board */}
          <div className="board-container">
            <div className="board-wrapper">
              <Chessboard
                id="analysis-board"
                position={boardPosition}
                boardWidth={440}
                arePiecesDraggable={false}
                customBoardStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}
                customDarkSquareStyle={{ backgroundColor: '#7C3AED' }}
                customLightSquareStyle={{ backgroundColor: '#E8E0F4' }}
              />
            </div>

            {/* Eval Bar */}
            <div className="eval-bar-container">
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Black</span>
              <div className="eval-bar">
                <div 
                  className="eval-bar-fill white" 
                  style={{ width: `${getEvalBarWidth()}%` }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>White</span>
              <span className="eval-value">{getEvalText()}</span>
            </div>

            {/* Move Navigation */}
            <div className="move-nav">
              <button onClick={() => goToMove(0)} disabled={currentMoveIndex === 0}>⏮</button>
              <button onClick={() => goToMove(currentMoveIndex - 1)} disabled={currentMoveIndex === 0}>◀</button>
              <span className="move-counter">
                Move {Math.floor(currentMoveIndex / 2) + (currentMoveIndex > 0 ? 1 : 0)} / {Math.ceil(analysisData.moves.length / 2)}
              </span>
              <button onClick={() => goToMove(currentMoveIndex + 1)} disabled={currentMoveIndex >= analysisData.fens.length - 1}>▶</button>
              <button onClick={() => goToMove(analysisData.fens.length - 1)} disabled={currentMoveIndex >= analysisData.fens.length - 1}>⏭</button>
            </div>
          </div>

          {/* Right: Move List + Blunders + Chat */}
          <div className="analysis-right-panel">
            {/* Move List */}
            <div className="move-list-container">
              <h4>Moves</h4>
              <div className="move-list">
                {analysisData.moves.map((move, idx) => (
                  <React.Fragment key={idx}>
                    {idx % 2 === 0 && <span className="move-number">{Math.floor(idx / 2) + 1}.</span>}
                    <button
                      className={`move-item ${currentMoveIndex === idx + 1 ? 'active' : ''} ${isBlunderMove(idx) ? 'blunder' : ''}`}
                      onClick={() => goToMove(idx + 1)}
                    >
                      {move}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Blunder Navigation */}
            {analysisData.blunders.length > 0 && (
              <div className="blunder-nav">
                <h4>🚨 Critical Moments ({analysisData.blunders.length})</h4>
                <div className="blunder-list">
                  {analysisData.blunders.map((blunder, idx) => (
                    <button
                      key={idx}
                      className={`blunder-item ${activeBlunderIndex === idx ? 'active' : ''}`}
                      onClick={() => startCoaching(blunder, idx)}
                    >
                      <div className="blunder-info">
                        <span className="blunder-move">
                          Move {blunder.moveNumber}: {blunder.movePlayed}
                        </span>
                        <span className="blunder-detail">
                          Best: {blunder.bestMove} • {blunder.tacticalTheme}
                        </span>
                      </div>
                      <span className="blunder-eval">
                        {blunder.evalDrop > 0 ? '-' : ''}{blunder.evalDrop.toFixed(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {analysisData.blunders.length === 0 && (
              <div className="blunder-nav">
                <h4>✅ No Major Blunders Found</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                  Great game! No significant evaluation drops were detected. 
                  Keep up the strong play! 🎉
                </p>
              </div>
            )}

            {/* Chat Panel */}
            <ChatPanel
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={chatLoading}
              blunderData={activeBlunder}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!analysisData && !isAnalyzing && (
        <div className="analysis-empty">
          <div className="empty-icon">♟️</div>
          <h3>Ready to Review Your Game</h3>
          <p>Paste a PGN above or load a sample game to start your AI-powered Socratic coaching session.</p>
        </div>
      )}
    </div>
  );
};

export default Analysis;
