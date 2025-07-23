import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import COLORS from '../theme/colors';

const HighScoreDisplay: React.FC = () => {
  const { highScores, loadHighScores } = useGameStore();

  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(0, 30, 60, 0.9), rgba(30, 0, 60, 0.9))',
      border: `2px solid ${COLORS.persianGreen}`,
      borderRadius: '10px',
      boxShadow: `0 0 20px ${COLORS.persianGreen}40`,
      backdropFilter: 'blur(10px)',
      maxWidth: '90vw',
      width: 'clamp(300px, 40vw, 400px)',
      fontFamily: 'monospace',
      color: COLORS.lightCyan
    }}>
      {/* Header */}
      <h2 style={{
        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
        margin: '0 0 1.5rem 0',
        color: COLORS.saffron,
        textShadow: `0 0 10px ${COLORS.saffron}`,
        textAlign: 'center',
        letterSpacing: '2px'
      }}>
        🏆 HIGH SCORES 🏆
      </h2>

      {/* High Scores List */}
      <div style={{ minHeight: '200px' }}>
        {highScores.length === 0 ? (
          <div style={{
            textAlign: 'center',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: COLORS.lightCyan,
            opacity: 0.7,
            padding: '3rem 0'
          }}>
            NO HIGH SCORES YET<br />
            BE THE FIRST!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 80px 80px',
              gap: '10px',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              color: COLORS.persianGreen,
              fontWeight: 'bold',
              paddingBottom: '0.5rem',
              borderBottom: `1px solid ${COLORS.persianGreen}40`
            }}>
              <div>RANK</div>
              <div>NAME</div>
              <div>SCORE</div>
              <div>LEVEL</div>
            </div>

            {/* Score Entries */}
            {Array.from({ length: 3 }, (_, index) => {
              const score = highScores[index];
              const rankEmojis = ['🥇', '🥈', '🥉'];
              const rankColors = [COLORS.saffron, '#C0C0C0', '#CD7F32'];
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 80px 80px',
                    gap: '10px',
                    fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
                    padding: '0.5rem 0',
                    backgroundColor: score ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    borderRadius: '5px',
                    color: score ? COLORS.lightCyan : '#666'
                  }}
                >
                  <div style={{
                    color: rankColors[index],
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {rankEmojis[index]} {index + 1}
                  </div>
                  
                  <div style={{
                    fontWeight: 'bold',
                    color: score ? COLORS.saffron : '#666',
                    letterSpacing: '2px'
                  }}>
                    {score ? score.initials : '---'}
                  </div>
                  
                  <div style={{
                    fontWeight: 'bold',
                    color: score ? COLORS.persianGreen : '#666',
                    textAlign: 'right'
                  }}>
                    {score ? score.score.toLocaleString() : '---'}
                  </div>
                  
                  <div style={{
                    color: score ? COLORS.lightCyan : '#666',
                    textAlign: 'right'
                  }}>
                    {score ? score.level : '--'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {highScores.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: `1px solid ${COLORS.persianGreen}40`,
          fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
          color: COLORS.lightCyan,
          opacity: 0.7,
          textAlign: 'center'
        }}>
          Last updated: {highScores[0]?.date || 'Unknown'}
        </div>
      )}
    </div>
  );
};

export default HighScoreDisplay; 