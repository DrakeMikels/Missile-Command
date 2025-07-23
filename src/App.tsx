import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import FloatingStartMenu from './components/FloatingStartMenu';
import GameOverScreen from './components/GameOverScreen';
import LevelTransition from './components/LevelTransition';
import './App.css';

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      position: 'relative',
      touchAction: 'manipulation',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none'
    }}>
      {/* 3D Game Canvas - Base Layer */}
      <GameCanvas />
      
      {/* UI Overlay - Top Layer */}
      <UIOverlay />
      
      {/* Start Menu - Overlay when needed */}
      <FloatingStartMenu />
      
      {/* Game Over Screen - Overlay when needed */}
      <GameOverScreen />
      
      {/* Level Transition - Overlay for milestone levels */}
      <LevelTransition />
      
      {/* Global Styles for Mobile Support */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: monospace;
            background: #000011;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
          }
          
          canvas {
            display: block;
            touch-action: manipulation;
          }
          
          @media (max-width: 768px) {
            html {
              font-size: 14px;
            }
          }
          
          @media (max-width: 480px) {
            html {
              font-size: 12px;
            }
          }
          
          /* Prevent zoom on double tap */
          @media (pointer: coarse) {
            button, canvas {
              touch-action: manipulation;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;
