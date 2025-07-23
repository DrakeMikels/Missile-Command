import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import COLORS from '../theme/colors';

const HighScoreEntry: React.FC = () => {
  const [initials, setInitials] = useState('');
  const { gameState, score, level, submitHighScore } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initials.length >= 1) {
      submitHighScore(initials);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    setInitials(value);
  };

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (gameState === 'enterHighScore') {
      const input = document.getElementById('initials-input');
      if (input) {
        input.focus();
      }
    }
  }, [gameState]);

  // Only show when entering high score
  if (gameState !== 'enterHighScore') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: 'monospace',
      color: COLORS.lightCyan
    }}>
      {/* Celebration Background Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 30%, ${COLORS.saffron}20 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, ${COLORS.persianGreen}20 0%, transparent 50%),
          radial-gradient(circle at 60% 20%, ${COLORS.burntSienna}20 0%, transparent 50%)
        `,
        animation: 'pulse 3s ease-in-out infinite'
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(0, 50, 100, 0.8), rgba(50, 0, 100, 0.8))',
        border: `2px solid ${COLORS.saffron}`,
        borderRadius: '10px',
        boxShadow: `0 0 30px ${COLORS.saffron}80`,
        backdropFilter: 'blur(10px)',
        maxWidth: '90vw',
        width: 'clamp(300px, 50vw, 500px)'
      }}>
        {/* Congratulations Header */}
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          margin: '0 0 1rem 0',
          color: COLORS.saffron,
          textShadow: `0 0 10px ${COLORS.saffron}`,
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          🎉 NEW HIGH SCORE! 🎉
        </h1>

        {/* Score Display */}
        <div style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          margin: '1rem 0',
          color: COLORS.lightCyan
        }}>
          <div>SCORE: <span style={{ color: COLORS.saffron, fontWeight: 'bold' }}>{score.toLocaleString()}</span></div>
          <div>LEVEL: <span style={{ color: COLORS.persianGreen, fontWeight: 'bold' }}>{level}</span></div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ margin: '2rem 0' }}>
          <div style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            margin: '1rem 0',
            color: COLORS.lightCyan
          }}>
            ENTER YOUR INITIALS:
          </div>
          
          <input
            id="initials-input"
            type="text"
            value={initials}
            onChange={handleInputChange}
            maxLength={3}
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              padding: '0.5rem 1rem',
              margin: '1rem 0',
              width: '8rem',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: `2px solid ${COLORS.persianGreen}`,
              borderRadius: '5px',
              color: COLORS.saffron,
              textShadow: `0 0 5px ${COLORS.saffron}`,
              outline: 'none',
              fontFamily: 'monospace',
              letterSpacing: '0.5rem'
            }}
            placeholder="AAA"
          />

          <div>
            <button
              type="submit"
              disabled={initials.length < 1}
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                padding: '0.8rem 2rem',
                margin: '1rem 0.5rem',
                backgroundColor: initials.length >= 1 ? COLORS.persianGreen : '#333',
                color: initials.length >= 1 ? '#000' : '#666',
                border: 'none',
                borderRadius: '5px',
                cursor: initials.length >= 1 ? 'pointer' : 'not-allowed',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                boxShadow: initials.length >= 1 ? `0 0 15px ${COLORS.persianGreen}80` : 'none'
              }}
            >
              SUBMIT
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div style={{
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          color: COLORS.lightCyan,
          opacity: 0.8,
          marginTop: '1rem'
        }}>
          Press ENTER to submit • Use A-Z letters only
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes glow {
          from { text-shadow: 0 0 10px ${COLORS.saffron}; }
          to { text-shadow: 0 0 20px ${COLORS.saffron}, 0 0 30px ${COLORS.saffron}; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        #initials-input:focus {
          border-color: ${COLORS.saffron} !important;
          box-shadow: 0 0 15px ${COLORS.saffron}80 !important;
        }
      `}</style>
    </div>
  );
};

export default HighScoreEntry; 