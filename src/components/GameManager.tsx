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
        // Get current game state for calculations
        const { level: currentLevel } = useGameStore.getState();
        const maxLevel = 20;
        const progressRatio = Math.min(currentLevel / maxLevel, 1);
        
        nextLevel();
        
        // Play level complete sound with special effects for milestone levels
        soundManager.playLevelComplete();
        
        // Level milestone notifications are now handled by LevelTransition component
        
        // Spawn power-ups more frequently at higher levels to help players
        const powerUpChance = 0.3 + (progressRatio * 0.4); // 30% to 70% chance
        if (Math.random() < powerUpChance) {
          spawnPowerUp();
        }
        
        // Check for victory at level 20 - victory message handled by LevelTransition component
        // Additional victory logic could be added here if needed
        
        // Dynamic wave timing - early levels much faster for immediate gratification
        const baseWaveDelay = currentLevel <= 5 ? 2000 : 4000; // 2s for levels 1-5, then 4s
        const waveDelay = baseWaveDelay - (progressRatio * 1000); // Fast progression
        
        lastWaveTimeRef.current = currentTime + waveDelay;
      }, level <= 5 ? 1500 : 3000 - (Math.min(level / 20, 1) * 1500)); // Much faster early level completion
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
    
    // Get current level from store
    const { level: currentLevel } = useGameStore.getState();
    
    // Random position above the battlefield
    const x = -8 + Math.random() * 16;
    const y = 2 + Math.random() * 4;
    
    // Power-up type based on level and random chance
    let type: 'scoreMultiplier' | 'shield' | 'rapidFire';
    let value: number;
    
    // Better power-ups at higher levels
    const rand = Math.random();
    const isHighLevel = currentLevel >= 15;
    
          if (rand < 0.5) {
        type = 'scoreMultiplier';
        if (isHighLevel) {
          value = currentLevel >= 18 ? 5 : 4; // 4x-5x multiplier at very high levels
        } else {
          value = currentLevel > 8 ? 3 : 2; // 2x-3x multiplier at mid levels
        }
    } else if (rand < 0.8) {
      type = 'shield';
      value = isHighLevel ? 8000 : 5000; // Longer shield duration at high levels
    } else {
      type = 'rapidFire';
      value = isHighLevel ? 5000 : 3000; // Longer rapid fire at high levels
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
    
    // Progressive difficulty scaling with level 20 cap - gets very challenging by level 20
    const maxLevel = 20;
    const progressRatio = Math.min(level / maxLevel, 1); // 0 to 1 progression
    
    // Speed progression: starts at 1.1, ends at 3.2 at level 20
    const baseSpeed = 1.1;
    const maxSpeed = 3.2;
    const speedIncrease = (maxSpeed - baseSpeed) * progressRatio;
    
    // Missile count: starts at 1, ends at 20 missiles at level 20 (faster early progression)
    const minMissiles = 1;
    const maxMissiles = 20;
    const missileCount = Math.floor(minMissiles + (maxMissiles - minMissiles) * progressRatio);
    
    // Split chance: 0% at level 1, 75% at level 20
    const maxSplitChance = 0.75;
    const splitChance = maxSplitChance * progressRatio;
    
    // Launch frequency increases dramatically (shorter delays between missiles)
    // Early levels launch much faster for quick wins
    const baseLaunchDelay = level <= 3 ? 600 : 1000; // Much faster for levels 1-3
    const minLaunchDelay = 200; // Very fast at level 20
    const launchDelayReduction = (baseLaunchDelay - minLaunchDelay) * progressRatio;
    const currentLaunchDelay = baseLaunchDelay - launchDelayReduction;
    
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
            soundManager.playSound('missileLaunch', 0.5, 1.2);
          }, 1000 + Math.random() * 2000);
        }
      }, i * (currentLaunchDelay + Math.random() * currentLaunchDelay * 0.5)); // Dynamic launch timing based on level
    }
  };
  
  return null; // This component doesn't render anything
};

export default GameManager; 