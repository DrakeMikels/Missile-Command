import { useFrame } from '@react-three/fiber';
import { useGameStore, type PowerUp } from '../store/gameStore';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { soundManager } from '../utils/soundManager';

const FloatingPowerUp = ({ powerUp }: { powerUp: PowerUp }) => {
  const powerUpRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Power-up colors and symbols
  const powerUpConfig = useMemo(() => {
    switch (powerUp.type) {
      case 'scoreMultiplier':
        return {
          color: '#ffff00',
          emissiveColor: '#ffaa00',
          symbol: '×2',
          glowColor: '#ffff00'
        };
      case 'shield':
        return {
          color: '#00ffff',
          emissiveColor: '#0088ff',
          symbol: '🛡',
          glowColor: '#00ffff'
        };
      case 'rapidFire':
        return {
          color: '#ff0088',
          emissiveColor: '#ff0044',
          symbol: '⚡',
          glowColor: '#ff0088'
        };
      default:
        return {
          color: '#ffffff',
          emissiveColor: '#ffffff',
          symbol: '?',
          glowColor: '#ffffff'
        };
    }
  }, [powerUp.type]);
  
  // Create text texture for symbol
  const symbolTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.clearRect(0, 0, 128, 128);
    
    // Draw symbol
    ctx.fillStyle = powerUpConfig.color;
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(powerUpConfig.symbol, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [powerUpConfig]);
  
  useFrame((state) => {
    if (!powerUpRef.current || powerUp.collected) return;
    
    const time = state.clock.elapsedTime;
    const elapsed = time - powerUp.startTime / 1000;
    
    // Floating animation
    const floatY = Math.sin(time * 2 + powerUp.x) * 0.3;
    powerUpRef.current.position.set(powerUp.x, powerUp.y + floatY, 0.5);
    
    // Rotation animation
    powerUpRef.current.rotation.y = time * 2;
    powerUpRef.current.rotation.z = Math.sin(time * 3) * 0.2;
    
    // Pulsing glow
    if (glowRef.current) {
      const pulse = (Math.sin(time * 4) + 1) * 0.5;
      const scale = 1.5 + pulse * 0.5;
      glowRef.current.scale.setScalar(scale);
      
      if (glowRef.current.material instanceof THREE.Material) {
        (glowRef.current.material as any).opacity = 0.3 + pulse * 0.4;
      }
    }
    
    // Fade out after 20 seconds (doubled from 10)
    if (elapsed > 20) {
      const fadeProgress = Math.min((elapsed - 20) / 3, 1); // 3 second fade instead of 2
      const opacity = 1 - fadeProgress;
      
      powerUpRef.current.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          (child.material as any).opacity = opacity;
        }
      });
      
      if (fadeProgress >= 1) {
        // Remove power-up after fade
        const { removePowerUp } = useGameStore.getState();
        removePowerUp(powerUp.id);
      }
    }
  });
  
  if (powerUp.collected) return null;
  
  return (
    <group ref={powerUpRef}>
      {/* Main power-up body */}
      <mesh castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={powerUpConfig.color}
          emissive={powerUpConfig.emissiveColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Symbol display */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial
          map={symbolTexture}
          transparent
          opacity={1}
          alphaTest={0.1}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <ringGeometry args={[0.25, 0.4, 16]} />
        <meshBasicMaterial
          color={powerUpConfig.glowColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Particle effects */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.4,
            Math.sin((i / 6) * Math.PI * 2) * 0.4,
            0
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color={powerUpConfig.glowColor}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

const PowerUps = () => {
  const { 
    powerUps, 
    interceptors, 
    collectPowerUp, 
    addScore 
  } = useGameStore();
  
  // Check for power-up collection
  useFrame(() => {
    powerUps.forEach(powerUp => {
      if (powerUp.collected) return;
      
      // Check collision with interceptor explosions
      interceptors.forEach(interceptor => {
        const distance = Math.sqrt(
          Math.pow(interceptor.targetX - powerUp.x, 2) + 
          Math.pow(interceptor.targetY - powerUp.y, 2)
        );
        
        if (distance <= 1.0) { // Within explosion radius
          collectPowerUp(powerUp.id);
          addScore(1000); // Bonus for collecting power-up
          
          // Play power-up collection sound
          soundManager.playPowerUp();
          
          // Create collection animation
          // TODO: Add particle burst animation
        }
      });
    });
  });
  
  return (
    <group>
      {powerUps.map(powerUp => (
        <FloatingPowerUp key={powerUp.id} powerUp={powerUp} />
      ))}
    </group>
  );
};

export default PowerUps; 