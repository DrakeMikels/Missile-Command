import React from 'react';
import { useGameStore } from '../store/gameStore';
import { initSounds, soundManager } from '../utils/soundManager';
import HighScoreDisplay from './HighScoreDisplay';
import AdBanner from './AdBanner';

const FloatingStartMenu = () => {
  const { gameState, startGame, loadHighScores, subscribeToGlobalLeaderboard } = useGameStore();

  // Load high scores and subscribe to real-time updates when component mounts
  React.useEffect(() => {
    // Load initial high scores
    loadHighScores();
    
    // Subscribe to real-time global leaderboard updates
    subscribeToGlobalLeaderboard();
  }, [loadHighScores, subscribeToGlobalLeaderboard]);

  if (gameState !== 'menu') return null;

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
      background: 'rgba(0, 0, 17, 0.7)',
      zIndex: 1000,
      pointerEvents: 'all',
      fontFamily: 'monospace'
    }}>
      {/* Main Menu Container */}
      <div style={{
        background: 'transparent',
        textAlign: 'center',
        width: '100%',
        maxWidth: '100vw',
        padding: '40px 20px 0 20px',
        boxSizing: 'border-box'
      }}>
        {/* PRESS START Title */}
        <div style={{
          fontSize: 'clamp(1.1rem, 5.5vw, 4rem)',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: 'clamp(1px, 0.7vw, 8px)',
          marginBottom: '20px',
          textTransform: 'uppercase',
          padding: '0 10px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #00ffff 0%, #ffffff 25%, #00ffff 50%, #ffffff 75%, #00ffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
            animation: 'glow 2s ease-in-out infinite alternate',
            textAlign: 'center',
            lineHeight: '1.1',
            maxWidth: '100%'
          }}>
            MISSILE COMMANDER
          </div>
        </div>
        
        {/* Insert Coin Text */}
        <p style={{
          color: 'white',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          marginBottom: '40px',
          fontFamily: 'monospace',
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          animation: 'blink 1.5s infinite'
        }}>
          Click or tap to launch interceptors
        </p>
        
        {/* Start Button */}
        <button
          onClick={async () => {
            console.log('Initializing sounds...');
            await initSounds(); // Initialize sounds on first interaction
            
            // Test sound system
            const soundWorking = await soundManager.testSound();
            console.log('Sound system status:', soundWorking ? 'Working' : 'Failed');
            
            if (soundWorking) {
              // Play a quick test sound to confirm
              setTimeout(() => soundManager.playInterceptor(0.3), 100);
            }
            
            startGame();
          }}
          style={{
            background: 'linear-gradient(45deg, #ff0088, #aa0066)',
            border: '2px solid #ff00ff',
            borderRadius: '0',
            color: 'white',
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            padding: 'clamp(15px, 3vw, 20px) clamp(40px, 8vw, 60px)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textShadow: '0 0 10px rgba(255, 0, 136, 0.8)',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(255, 0, 136, 0.2)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            position: 'relative',
            overflow: 'hidden',
            touchAction: 'manipulation'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.8), inset 0 0 30px rgba(255, 0, 136, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(45deg, #ff00aa, #cc0088)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(255, 0, 136, 0.2)';
            e.currentTarget.style.background = 'linear-gradient(45deg, #ff0088, #aa0066)';
          }}
        >
          START GAME
        </button>

        {/* High Score Display */}
        <div style={{ 
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <HighScoreDisplay />
        </div>

        {/* Advertisement */}
        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          <AdBanner 
            adSlot="0987654321" 
            width={728}
            height={90}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 255, 255, 0.1)',
              borderRadius: '5px',
              padding: '10px'
            }}
          />
        </div>

        {/* Donation Button */}
        <div style={{ marginTop: '30px' }}>
          <a
            href="https://venmo.com/u/Mike-Drake-1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(45deg, #00ffff, #0088cc)',
              border: '2px solid #00ffff',
              borderRadius: '0',
              color: '#000',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              padding: 'clamp(6px, 1.5vw, 10px) clamp(15px, 3vw, 20px)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textDecoration: 'none',
              textShadow: '0 0 5px rgba(0, 255, 255, 0.8)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              position: 'relative',
              overflow: 'hidden',
              touchAction: 'manipulation'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.6), inset 0 0 25px rgba(0, 255, 255, 0.2)';
              e.currentTarget.style.background = 'linear-gradient(45deg, #00ffff, #00aaff)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.1)';
              e.currentTarget.style.background = 'linear-gradient(45deg, #00ffff, #0088cc)';
            }}
          >
            <span style={{ fontSize: '1.5em', marginRight: '8px' }}>☕</span>
            Buy Me a Coffee
          </a>
          <p style={{
            color: '#00ffff',
            fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
            marginTop: '8px',
            fontFamily: 'monospace',
            opacity: 0.8,
            textShadow: '0 0 5px rgba(0, 255, 255, 0.5)'
          }}>
            Support retro gaming development!
          </p>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>
        {`
          @keyframes glow {
            0% { 
              filter: brightness(1) drop-shadow(0 0 20px #00ffff);
              transform: scale(1);
            }
            100% { 
              filter: brightness(1.2) drop-shadow(0 0 30px #00ffff);
              transform: scale(1.02);
            }
          }
          
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
};

export default FloatingStartMenu; 