import { useGameStore } from '../store/gameStore';
import AdBanner from './AdBanner';

const GameOverScreen = () => {
  const { gameState, score, level, startGame } = useGameStore();

  if (gameState !== 'gameOver') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 17, 0.8)',
      zIndex: 2000,
      pointerEvents: 'all',
      fontFamily: 'monospace'
    }}>
      {/* Main Game Over Container */}
      <div style={{
        background: 'transparent',
        textAlign: 'center'
      }}>
        {/* GAME OVER Title */}
        <div style={{
          fontSize: 'clamp(2.5rem, 10vw, 5rem)',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: '8px',
          marginBottom: '30px',
          textTransform: 'uppercase'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #ff0088 0%, #ff00ff 25%, #ff0088 50%, #ff00ff 75%, #ff0088 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px #ff0088, 0 0 40px #ff0088',
            animation: 'gameOverGlow 2s ease-in-out infinite alternate'
          }}>
            GAME OVER
          </div>
        </div>
        
        {/* Final Score */}
        <div style={{
          color: '#00ffff',
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          marginBottom: '20px',
          fontFamily: 'monospace',
          letterSpacing: '3px',
          textShadow: '0 0 15px #00ffff'
        }}>
          FINAL SCORE: {score.toLocaleString().padStart(8, '0')}
        </div>
        
        {/* Level Reached */}
        <div style={{
          color: '#ffff00',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          marginBottom: '40px',
          fontFamily: 'monospace',
          letterSpacing: '2px',
          textShadow: '0 0 10px #ffff00',
          opacity: 0.9
        }}>
          LEVEL REACHED: {level.toString().padStart(2, '0')}
        </div>
        
        {/* Play Again Button */}
        <button
          onClick={startGame}
          style={{
            background: 'linear-gradient(45deg, #00ffff, #0088ff)',
            border: '2px solid #00ffff',
            borderRadius: '0',
            color: 'white',
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            padding: 'clamp(15px, 3vw, 20px) clamp(40px, 8vw, 60px)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 136, 255, 0.2)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            position: 'relative',
            overflow: 'hidden',
            touchAction: 'manipulation'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(0, 136, 255, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(45deg, #00ddff, #0066ff)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 136, 255, 0.2)';
            e.currentTarget.style.background = 'linear-gradient(45deg, #00ffff, #0088ff)';
          }}
        >
          PLAY AGAIN
        </button>
        
        {/* High Score Message */}
        <div style={{
          color: '#ff8800',
          fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)',
          marginTop: '30px',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          textShadow: '0 0 8px #ff8800',
          opacity: 0.8,
          animation: 'blink 2s infinite'
        }}>
          {score > 50000 ? 'NEW HIGH SCORE!' : 'TRY FOR A HIGHER SCORE!'}
        </div>

        {/* Advertisement */}
        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          <AdBanner 
            adSlot="1234567890" 
            width={320}
            height={100}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              borderRadius: '5px',
              padding: '10px'
            }}
          />
        </div>

        {/* Subtle Donation Link */}
        <div style={{ marginTop: '15px' }}>
          <a
            href="https://venmo.com/u/Mike-Drake-1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              color: '#00ffff',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
              fontFamily: 'monospace',
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'all 0.3s ease',
              textShadow: '0 0 3px rgba(0, 255, 255, 0.5)',
              borderBottom: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.8)';
              e.currentTarget.style.borderBottom = '1px solid #00ffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.textShadow = '0 0 3px rgba(0, 255, 255, 0.5)';
              e.currentTarget.style.borderBottom = '1px solid transparent';
            }}
          >
            <span style={{ fontSize: '1.3em', marginRight: '6px' }}>☕</span>
            Enjoyed the game? Buy me a coffee!
          </a>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes gameOverGlow {
            0% { 
              filter: brightness(1) drop-shadow(0 0 20px #ff0088);
              transform: scale(1);
            }
            100% { 
              filter: brightness(1.3) drop-shadow(0 0 30px #ff0088);
              transform: scale(1.02);
            }
          }
          
          @keyframes blink {
            0%, 50% { opacity: 0.8; }
            51%, 100% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
};

export default GameOverScreen; 