import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { useRef } from 'react';

const GameManager = () => {
  const { 
    gameState, 
    level, 
    missiles, 
    cities,
    addMissile, 
    nextLevel 
  } = useGameStore();
  
  const lastWaveTimeRef = useRef<number>(0);
  const waveInProgressRef = useRef<boolean>(false);
  
  useFrame(() => {
    if (gameState !== 'playing') return;
    
    const currentTime = Date.now();
    
    // Check if current wave is complete
    if (missiles.length === 0 && waveInProgressRef.current) {
      waveInProgressRef.current = false;
      
      // Wait a moment before next wave
      setTimeout(() => {
        nextLevel();
        lastWaveTimeRef.current = currentTime + 3000; // 3 second delay
      }, 2000);
      return;
    }
    
    // Start new wave
    if (!waveInProgressRef.current && currentTime > lastWaveTimeRef.current + 5000) {
      startWave();
      waveInProgressRef.current = true;
      lastWaveTimeRef.current = currentTime;
    }
  });
  
  const startWave = () => {
    const activeCities = cities.filter(city => !city.destroyed);
    if (activeCities.length === 0) return;
    
    // Difficulty scaling
    const baseSpeed = 2;
    const speedIncrease = Math.min(level * 0.3, 3); // Cap speed increase
    const missileCount = Math.min(3 + level, 12); // Cap missile count
    const splitChance = Math.min(level * 0.1, 0.4); // Cap split chance at 40%
    
    for (let i = 0; i < missileCount; i++) {
      // Random delay for each missile
      setTimeout(() => {
        const targetCity = activeCities[Math.floor(Math.random() * activeCities.length)];
        
        // Random starting position at top of screen
        const startX = -10 + Math.random() * 20;
        
        // Add some randomness to target (not always direct hit)
        const targetX = targetCity.x + (Math.random() - 0.5) * 2;
        const targetY = -2 + Math.random() * 0.5; // Updated to match new grid level
        
        addMissile({
          x: startX,
          y: 10,
          targetX,
          targetY,
          speed: baseSpeed + speedIncrease,
          startTime: Date.now()
        });
        
        // Random missile splitting for higher levels
        if (Math.random() < splitChance && level > 3) {
          setTimeout(() => {
            const splitTarget = activeCities[Math.floor(Math.random() * activeCities.length)];
            addMissile({
              x: startX + (Math.random() - 0.5) * 2,
              y: 8,
              targetX: splitTarget.x + (Math.random() - 0.5) * 2,
              targetY: -2 + Math.random() * 0.5, // Updated to match new grid level
              speed: baseSpeed + speedIncrease * 0.8,
              startTime: Date.now()
            });
          }, 1000 + Math.random() * 2000);
        }
      }, i * (1000 + Math.random() * 1500)); // Stagger missile launches
    }
  };
  
  return null; // This component doesn't render anything
};

export default GameManager; 