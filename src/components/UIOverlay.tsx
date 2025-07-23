import { useGameStore } from '../store/gameStore';

const UIOverlay = () => {
  const { gameState, score, level, lives, cities } = useGameStore();

  if (gameState === 'menu') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'clamp(60px, 12vh, 100px)',
      background: 'linear-gradient(to top, rgba(0, 0, 17, 0.95), rgba(0, 0, 17, 0.7))',
      backdropFilter: 'blur(10px)',
      borderTop: '2px solid #ff00ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 clamp(10px, 3vw, 30px)',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      zIndex: 1000,
      boxShadow: '0 -5px 20px rgba(255, 0, 255, 0.3)',
      fontSize: 'clamp(12px, 2.5vw, 18px)'
    }}>
      {/* Left Section - Score */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        color: '#00ffff',
        textShadow: '0 0 10px #00ffff'
      }}>
        <div style={{ fontSize: 'clamp(10px, 2vw, 14px)', opacity: 0.8 }}>SCORE</div>
        <div style={{ fontSize: 'clamp(16px, 3.5vw, 24px)', letterSpacing: '2px' }}>
          {score.toLocaleString().padStart(8, '0')}
        </div>
      </div>

      {/* Center Section - Level */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#ffff00',
        textShadow: '0 0 10px #ffff00'
      }}>
        <div style={{ fontSize: 'clamp(10px, 2vw, 14px)', opacity: 0.8 }}>LEVEL</div>
        <div style={{ 
          fontSize: 'clamp(20px, 4vw, 28px)', 
          letterSpacing: '2px',
          background: 'linear-gradient(45deg, #ffff00, #ffa500)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {level.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Right Section - Lives & Cities */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 'clamp(2px, 1vh, 8px)'
      }}>
        {/* Lives */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1vw, 8px)',
          color: '#ff0088',
          textShadow: '0 0 10px #ff0088'
        }}>
          <span style={{ fontSize: 'clamp(10px, 2vw, 14px)', opacity: 0.8 }}>LIVES</span>
          <div style={{ display: 'flex', gap: 'clamp(2px, 0.5vw, 4px)' }}>
            {Array.from({ length: lives }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 'clamp(8px, 2vw, 12px)',
                  height: 'clamp(8px, 2vw, 12px)',
                  background: 'linear-gradient(45deg, #ff0088, #ff00ff)',
                  borderRadius: '2px',
                  boxShadow: '0 0 5px #ff0088',
                  animation: 'pulse 2s infinite'
                }}
              />
            ))}
          </div>
        </div>

        {/* Cities */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1vw, 8px)',
          color: '#00ff88',
          textShadow: '0 0 10px #00ff88'
        }}>
          <span style={{ fontSize: 'clamp(10px, 2vw, 14px)', opacity: 0.8 }}>CITIES</span>
          <div style={{ display: 'flex', gap: 'clamp(1px, 0.3vw, 2px)' }}>
            {cities.map((city, i) => (
              <div
                key={i}
                style={{
                  width: 'clamp(6px, 1.5vw, 10px)',
                  height: 'clamp(10px, 2.5vw, 16px)',
                  background: city.destroyed 
                    ? 'linear-gradient(45deg, #444, #666)' 
                    : 'linear-gradient(45deg, #00ff88, #00ffff)',
                  borderRadius: '1px',
                  opacity: city.destroyed ? 0.3 : 1,
                  boxShadow: city.destroyed ? 'none' : '0 0 3px #00ff88',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.9); }
          }
        `}
      </style>
    </div>
  );
};

export default UIOverlay; 