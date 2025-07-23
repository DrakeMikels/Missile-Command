import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { useRef } from 'react';
import { soundManager } from '../utils/soundManager';

const GameManager = () => {
  const { 
    gameState, 
    level, 
    missiles, 
    cities,
    addMissile, 
    nextLevel,
    addPowerUp 
  } = useGameStore();
  
  const lastWaveTimeRef = useRef<number>(0);
  const waveInProgressRef = useRef<boolean>(false);
  
  useFrame(() => {
    if (gameState !== 'playing') return;
    
    const currentTime = Date.now();
    
    // Check if current wave is complete
    if (missiles.length === 0 && waveInProgressRef.current) {
      waveInProgressRef.current = false;
      
      // Wait a moment before next wave - longer delay for breathing room
      setTimeout(() => {
        nextLevel();
        
        // Play level complete sound
        soundManager.playLevelComplete();
        
        // Spawn power-ups more often to help players (40% chance per level)
        if (Math.random() < 0.4) {
          spawnPowerUp();
        }
        
        lastWaveTimeRef.current = currentTime + 4000; // Increased to 4 second delay
      }, 3000); // Increased from 2 to 3 seconds
      return;
    }
    
    // Start new wave
    if (!waveInProgressRef.current && currentTime > lastWaveTimeRef.current + 5000) {
      startWave();
      waveInProgressRef.current = true;
      lastWaveTimeRef.current = currentTime;
    }
  });
  
  const spawnPowerUp = () => {
    const activeCities = cities.filter(city => !city.destroyed);
    if (activeCities.length === 0) return;
    
    // Random position above the battlefield
    const x = -8 + Math.random() * 16;
    const y = 2 + Math.random() * 4;
    
    // Power-up type based on level and random chance
    let type: 'scoreMultiplier' | 'shield' | 'rapidFire';
    let value: number;
    
    const rand = Math.random();
    if (rand < 0.6) {
      type = 'scoreMultiplier';
      value = level > 5 ? 3 : 2; // Higher multiplier at higher levels
    } else if (rand < 0.8) {
      type = 'shield';
      value = 5000; // Shield duration in ms
    } else {
      type = 'rapidFire';
      value = 3000; // Rapid fire duration in ms
    }
    
    addPowerUp({
      x,
      y,
      type,
      value,
      startTime: Date.now(),
      collected: false
    });
  };

  const startWave = () => {
    const activeCities = cities.filter(city => !city.destroyed);
    if (activeCities.length === 0) return;
    
    // Difficulty scaling - gentler progression to keep players engaged longer
    const baseSpeed = 1.1; // Slightly slower base speed
    const speedIncrease = Math.min(level * 0.15, 1.8); // More gradual speed increase
    const missileCount = Math.min(2 + Math.floor(level * 1.2), 12); // Gentler missile count increase
    const splitChance = Math.min(level * 0.08, 0.4); // Slower split chance progression
    
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
        
        // Play missile launch sound
        soundManager.playMissileLaunch();
        
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
            
            // Play split missile sound (higher pitch)
            soundManager.playMissileLaunch(0.5, 1.2);
          }, 1000 + Math.random() * 2000);
        }
      }, i * (1200 + Math.random() * 1800)); // More staggered missile launches for easier gameplay
    }
  };
  
  return null; // This component doesn't render anything
};

export default GameManager; 