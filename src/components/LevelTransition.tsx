import { useGameStore } from '../store/gameStore';
import { useState, useEffect } from 'react';

const LevelTransition = () => {
  const { level } = useGameStore();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Check for milestone levels and show transition
    if (level === 5) {
      setTitle('🚀 LEVEL 5 REACHED! 🚀');
      setMessage('You are showing skill, Commander!\nDifficulty is starting to increase!');
      showTransition();
    } else if (level === 10) {
      setTitle('⚡ LEVEL 10 REACHED! ⚡');
      setMessage('The intensity is ramping up!\nMissiles are getting faster and more frequent!');
      showTransition();
    } else if (level === 15) {
      setTitle('🔥 LEVEL 15 REACHED! 🔥');
      setMessage('You are in the danger zone!\nMissile splits are becoming deadly!');
      showTransition();
    } else if (level === 20) {
      setTitle('💀 FINAL LEVEL 20! 💀');
      setMessage('This is it - the ultimate test!\nSurvive this wave to become the ultimate MISSILE COMMANDER!');
      showTransition();
    }
  }, [level]);

  const showTransition = () => {
    setShow(true);
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      pointerEvents: 'none',
      background: 'rgba(0, 0, 17, 0.8)',
      backdropFilter: 'blur(4px)',
      animation: show ? 'levelTransitionIn 0.5s ease-out' : 'levelTransitionOut 0.3s ease-in'
    }}>
      {/* Transition Container */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(20px, 5vw, 40px)',
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 136, 0.1))',
        border: '2px solid rgba(0, 255, 255, 0.5)',
        borderRadius: '12px',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1)',
        animation: 'levelPulse 2s ease-in-out infinite alternate',
        maxWidth: '80vw'
      }}>
        {/* Level Title */}
        <div style={{
          fontSize: 'clamp(1.5rem, 6vw, 3rem)',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: 'clamp(2px, 1vw, 6px)',
          marginBottom: '20px',
          textTransform: 'uppercase',
          background: 'linear-gradient(45deg, #00ffff, #ff0088, #ffff00, #ff0088, #00ffff)',
          backgroundSize: '400% 400%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradientShift 2s ease-in-out infinite',
          textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
        }}>
          {title}
        </div>

        {/* Level Message */}
        <div style={{
          color: '#ffffff',
          fontSize: 'clamp(0.9rem, 3vw, 1.4rem)',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          lineHeight: '1.6',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          opacity: 0.9,
          whiteSpace: 'pre-line'
        }}>
          {message}
        </div>

        {/* Progress Indicator */}
        <div style={{
          marginTop: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{
            color: '#00ffff',
            fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)',
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }}>
            LEVEL {level}/20
          </div>
          
          {/* Progress Bar */}
          <div style={{
            width: 'clamp(100px, 20vw, 200px)',
            height: '6px',
            background: 'rgba(0, 255, 255, 0.2)',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 255, 255, 0.3)'
          }}>
            <div style={{
              width: `${(level / 20) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00ffff, #ff0088)',
              borderRadius: '3px',
              animation: 'progressGlow 1.5s ease-in-out infinite alternate'
            }} />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes levelTransitionIn {
            0% { 
              opacity: 0;
              transform: scale(0.8);
            }
            100% { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes levelTransitionOut {
            0% { 
              opacity: 1;
              transform: scale(1);
            }
            100% { 
              opacity: 0;
              transform: scale(0.9);
            }
          }
          
          @keyframes levelPulse {
            0% { 
              transform: scale(1);
              boxShadow: 0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1);
            }
            100% { 
              transform: scale(1.02);
              boxShadow: 0 0 40px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.2);
            }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes progressGlow {
            0% { 
              box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
            }
            100% { 
              box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LevelTransition; 