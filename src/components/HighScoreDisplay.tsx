import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import COLORS from '../theme/colors';

const HighScoreDisplay: React.FC = () => {
  const { highScores, loadHighScores } = useGameStore();

  useEffect(() => {
    // Load high scores asynchronously
    const loadScores = async () => {
      try {
        await loadHighScores();
      } catch (error) {
        console.error('Failed to load high scores:', error);
      }
    };
    
    loadScores();
  }, [loadHighScores]);

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(0, 30, 60, 0.9), rgba(30, 0, 60, 0.9))',
      border: `2px solid ${COLORS.persianGreen}`,
      borderRadius: '10px',
      boxShadow: `0 0 20px ${COLORS.persianGreen}40`,
      backdropFilter: 'blur(10px)',
      maxWidth: '95vw',
      width: 'clamp(320px, 50vw, 500px)',
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
        🌍 GLOBAL TOP 10 🌍
      </h2>

      {/* High Scores List */}
      <div style={{ 
        minHeight: '300px',
        maxHeight: '60vh',
        overflowY: 'auto'
      }}>
        {highScores.length === 0 ? (
          <div style={{
            textAlign: 'center',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: COLORS.lightCyan,
            opacity: 0.7,
            padding: '3rem 0'
          }}>
            NO SCORES YET<br />
            BE THE FIRST CHAMPION!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 70px 60px',
              gap: '8px',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
              color: COLORS.persianGreen,
              fontWeight: 'bold',
              paddingBottom: '0.5rem',
              borderBottom: `1px solid ${COLORS.persianGreen}40`,
              position: 'sticky',
              top: 0,
              backgroundColor: 'rgba(0, 30, 60, 0.95)',
              zIndex: 1
            }}>
              <div>RANK</div>
              <div>NAME</div>
              <div>SCORE</div>
              <div>LVL</div>
            </div>

            {/* Score Entries */}
            {Array.from({ length: 10 }, (_, index) => {
              const score = highScores[index];
              const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
              const getRankColor = (rank: number) => {
                if (rank === 0) return COLORS.saffron; // Gold
                if (rank === 1) return '#C0C0C0'; // Silver  
                if (rank === 2) return '#CD7F32'; // Bronze
                return COLORS.lightCyan; // Regular cyan for 4-10
              };
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 70px 60px',
                    gap: '8px',
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                    padding: '0.4rem 0',
                    backgroundColor: score ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    borderRadius: '3px',
                    color: score ? COLORS.lightCyan : '#444',
                    borderLeft: score && index < 3 ? `3px solid ${getRankColor(index)}` : 'none',
                    paddingLeft: score && index < 3 ? '0.5rem' : '0'
                  }}
                >
                  <div style={{
                    color: getRankColor(index),
                    fontWeight: index < 3 ? 'bold' : 'normal',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)'
                  }}>
                    {score ? rankEmojis[index] : `${index + 1}.`}
                  </div>
                  
                  <div style={{
                    fontWeight: index < 3 ? 'bold' : 'normal',
                    color: score ? (index < 3 ? COLORS.saffron : COLORS.lightCyan) : '#444',
                    letterSpacing: '1px',
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)'
                  }}>
                    {score ? score.initials : '---'}
                  </div>
                  
                  <div style={{
                    fontWeight: index < 3 ? 'bold' : 'normal',
                    color: score ? COLORS.persianGreen : '#444',
                    textAlign: 'right',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)'
                  }}>
                    {score ? (score.score >= 1000000 ? 
                      `${(score.score / 1000000).toFixed(1)}M` : 
                      score.score >= 1000 ? 
                      `${(score.score / 1000).toFixed(0)}K` : 
                      score.score.toLocaleString()) : '---'}
                  </div>
                  
                  <div style={{
                    color: score ? COLORS.lightCyan : '#444',
                    textAlign: 'right',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)'
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