import { useFrame } from '@react-three/fiber';
import { useGameStore, type Explosion } from '../store/gameStore';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import COLORS from '../theme/colors';
import { soundManager } from '../utils/soundManager';

const CinematicExplosion = ({ explosion }: { explosion: Explosion }) => {
  const explosionGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const smokeRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const volumetricRef = useRef<THREE.Group>(null);
  
  // Play explosion sound when created
  useEffect(() => {
    soundManager.playExplosion();
  }, []);

  // Create gradient textures for smoother explosion effects
  const gradientTextures = useMemo(() => {
    // Core gradient texture (white to orange)
    const coreCanvas = document.createElement('canvas');
    coreCanvas.width = 64;
    coreCanvas.height = 64;
    const coreCtx = coreCanvas.getContext('2d')!;
    
    const coreGradient = coreCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); // White center with transparency
    coreGradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.6)'); // Warm yellow with transparency
    coreGradient.addColorStop(0.7, 'rgba(255, 100, 50, 0.4)'); // Orange with more transparency
    coreGradient.addColorStop(1, 'rgba(255, 50, 0, 0)'); // Transparent red edge
    
    coreCtx.fillStyle = coreGradient;
    coreCtx.fillRect(0, 0, 64, 64);
    
    // Shockwave gradient texture (cyan to transparent)
    const shockCanvas = document.createElement('canvas');
    shockCanvas.width = 64;
    shockCanvas.height = 64;
    const shockCtx = shockCanvas.getContext('2d')!;
    
    const shockGradient = shockCtx.createRadialGradient(32, 32, 20, 32, 32, 32);
    shockGradient.addColorStop(0, 'rgba(0, 255, 255, 0)'); // Transparent center
    shockGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.8)'); // Bright cyan
    shockGradient.addColorStop(0.8, 'rgba(100, 255, 255, 0.6)'); // Light cyan
    shockGradient.addColorStop(1, 'rgba(0, 255, 255, 0)'); // Transparent edge
    
    shockCtx.fillStyle = shockGradient;
    shockCtx.fillRect(0, 0, 64, 64);

    return {
      coreTexture: new THREE.CanvasTexture(coreCanvas),
      shockTexture: new THREE.CanvasTexture(shockCanvas)
    };
  }, []);
  
  // Generate advanced particle system
  const particles = useMemo(() => {
    const particleCount = 30;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (i / particleCount) * Math.PI * 2,
      speed: 1.2 + Math.random() * 2.5,
      size: 0.04 + Math.random() * 0.12,
      verticalSpeed: Math.random() * 2,
      color: Math.random() > 0.4 ? COLORS.saffron : COLORS.burntSienna,
      emissiveIntensity: 0.8 + Math.random() * 1.2,
      life: Math.random()
    }));
  }, []);
  
  // Volumetric smoke particles
  const smokeParticles = useMemo(() => {
    const smokeCount = 15;
    return Array.from({ length: smokeCount }, (_, i) => ({
      id: i,
      angle: (i / smokeCount) * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      size: 0.15 + Math.random() * 0.25,
      drift: (Math.random() - 0.5) * 0.8,
      rise: 0.5 + Math.random() * 1.5,
      opacity: 0.6 + Math.random() * 0.4
    }));
  }, []);
  
  // Volumetric light rays
  const lightRays = useMemo(() => {
    const rayCount = 8;
    return Array.from({ length: rayCount }, (_, i) => ({
      angle: (i / rayCount) * Math.PI * 2,
      length: 0.8 + Math.random() * 1.2,
      width: 0.1 + Math.random() * 0.2
    }));
  }, []);
  
  useFrame(() => {
    if (!explosionGroupRef.current || !coreRef.current || !shockwaveRef.current) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - explosion.startTime;
    const progress = Math.min(elapsed / explosion.duration, 1);
    
    // Advanced easing for realistic explosion dynamics
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const easeInOutCubic = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    // Core explosion with pulsing effect
    const coreRadius = explosion.maxRadius * easeOutQuart;
    const pulse = 1 + Math.sin(currentTime * 0.02) * 0.15;
    coreRef.current.scale.setScalar(coreRadius * pulse);
    
    // Multi-layered shockwave system
    const shockwaveRadius = explosion.maxRadius * 2 * easeInOutCubic;
    shockwaveRef.current.scale.setScalar(shockwaveRadius);
    
    // Dynamic opacity with flickering
    const flicker = 0.9 + Math.sin(currentTime * 0.05) * 0.1;
    const coreOpacity = Math.max(0, (1 - progress * 1.2)) * flicker;
    const shockwaveOpacity = Math.max(0, (1 - progress) * 0.4) * flicker;
    
    if (coreRef.current.material instanceof THREE.Material) {
      (coreRef.current.material as any).opacity = coreOpacity;
      (coreRef.current.material as any).emissiveIntensity = 2.5 * coreOpacity;
    }
    
    if (shockwaveRef.current.material instanceof THREE.Material) {
      (shockwaveRef.current.material as any).opacity = shockwaveOpacity;
    }
    
    // Advanced particle animation
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle: THREE.Object3D, i: number) => {
        const particleData = particles[i];
        const distance = particleData.speed * progress * 4;
        const verticalOffset = particleData.verticalSpeed * progress * 3;
        const drift = Math.sin(currentTime * 0.01 + i) * 0.3;
        
        particle.position.set(
          Math.cos(particleData.angle) * distance + drift,
          Math.sin(particleData.angle) * distance + verticalOffset,
          (Math.random() - 0.5) * 0.8
        );
        
        // Dynamic particle scaling and fading
        const particleLife = Math.max(0, particleData.life - progress * 1.5);
        const particleScale = (1 + progress * 3) * (0.5 + particleLife);
        particle.scale.setScalar(particleScale);
        
        if (particle instanceof THREE.Mesh && particle.material instanceof THREE.Material) {
          (particle.material as any).opacity = particleLife * 0.9;
          (particle.material as any).emissiveIntensity = particleData.emissiveIntensity * particleLife;
        }
      });
    }
    
    // Volumetric smoke animation
    if (smokeRef.current) {
      smokeRef.current.children.forEach((smoke: THREE.Object3D, i: number) => {
        const smokeData = smokeParticles[i];
        const distance = smokeData.speed * progress * 2.5;
        const rise = smokeData.rise * progress * 4;
        const drift = smokeData.drift * progress * 3;
        const turbulence = Math.sin(currentTime * 0.008 + i) * 0.5;
        
        smoke.position.set(
          Math.cos(smokeData.angle) * distance + drift + turbulence,
          Math.sin(smokeData.angle) * distance + rise,
          (Math.random() - 0.5) * 0.6
        );
        
        const smokeScale = (1 + progress * 4) * smokeData.size;
        const smokeOpacity = Math.max(0, smokeData.opacity * (0.8 - progress * 0.9));
        smoke.scale.setScalar(smokeScale);
        
        if (smoke instanceof THREE.Mesh && smoke.material instanceof THREE.Material) {
          (smoke.material as any).opacity = smokeOpacity;
        }
      });
    }
    
    // Volumetric light rays
    if (volumetricRef.current) {
      volumetricRef.current.children.forEach((ray, i) => {
        const rayData = lightRays[i];
        const intensity = Math.max(0, (1 - progress) * 0.8);
        ray.scale.set(rayData.width, rayData.length * (1 + progress * 2), rayData.width);
        
        if ((ray as THREE.Mesh).material instanceof THREE.Material) {
          ((ray as THREE.Mesh).material as any).opacity = intensity * 0.3;
        }
      });
    }
    
    // Enhanced glow effect
    if (glowRef.current) {
      const glowScale = explosion.maxRadius * 3 * easeOutQuart;
      const glowIntensity = Math.max(0, (1 - progress) * 0.8);
      glowRef.current.scale.setScalar(glowScale);
      
      if (glowRef.current.material instanceof THREE.Material) {
        (glowRef.current.material as any).opacity = glowIntensity * 0.15;
        (glowRef.current.material as any).emissiveIntensity = glowIntensity * 0.6;
      }
    }
  });
  
  return (
    <group ref={explosionGroupRef} position={[explosion.x, explosion.y, 0]}>
      {/* Volumetric light rays */}
      <group ref={volumetricRef}>
        {lightRays.map((ray, i) => (
          <mesh
            key={i}
            rotation={[0, 0, ray.angle]}
            position={[0, 0, 0]}
          >
            <cylinderGeometry args={[ray.width, ray.width * 0.1, ray.length, 6]} />
            <meshBasicMaterial
              color={COLORS.saffron}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      
      {/* Main explosion core - smaller and more jagged */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshStandardMaterial 
          color={COLORS.saffron}
          emissive={COLORS.saffron}
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Secondary explosion layer with gradient fade */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.3, 24, 24]} />
        <meshBasicMaterial 
          color={COLORS.burntSienna}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Smooth gradient shockwave ring */}
      <mesh ref={shockwaveRef}>
        <ringGeometry args={[0.6, 1.4, 48]} />
        <meshBasicMaterial 
          map={gradientTextures.shockTexture}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Advanced fire particles */}
      <group ref={particlesRef}>
        {particles.map(particle => (
          <mesh key={particle.id}>
            <sphereGeometry args={[particle.size, 8, 8]} />
            <meshStandardMaterial 
              color={particle.color}
              emissive={particle.color}
              emissiveIntensity={particle.emissiveIntensity}
              transparent
              opacity={0.9}
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Volumetric smoke system */}
      <group ref={smokeRef}>
        {smokeParticles.map(smoke => (
          <mesh key={smoke.id}>
            <sphereGeometry args={[smoke.size, 12, 12]} />
            <meshStandardMaterial 
              color="#2a2a2a"
              transparent
              opacity={smoke.opacity}
              roughness={1}
              metalness={0}
            />
          </mesh>
        ))}
      </group>
      
      {/* Outer atmospheric glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={COLORS.saffron}
          emissive={COLORS.saffron}
          emissiveIntensity={0.6}
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0}
        />
      </mesh>
      
      {/* Heat distortion sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 12, 12]} />
        <meshStandardMaterial 
          color="#ff4400"
          transparent
          opacity={0.03}
          roughness={0}
          metalness={0}
        />
      </mesh>
    </group>
  );
};

const Explosions = () => {
  const { 
    explosions, 
    missiles, 
    removeMissile, 
    addScore 
  } = useGameStore();
  
  // Enhanced collision detection with better precision
  useFrame(() => {
    explosions.forEach(explosion => {
      const currentTime = Date.now();
      const elapsed = currentTime - explosion.startTime;
      const progress = Math.min(elapsed / explosion.duration, 1);
      const currentRadius = explosion.maxRadius * progress;
      
      // Check collision with missiles using improved detection - more sensitive
      missiles.forEach(missile => {
        const distance = Math.sqrt(
          Math.pow(missile.x - explosion.x, 2) + 
          Math.pow(missile.y - explosion.y, 2)
        );
        
        // Increased sensitivity: missiles destroyed at 1.3x the explosion radius
        if (distance <= currentRadius * 1.3) {
          removeMissile(missile.id);
          // Amplified scoring with level bonuses
          const baseScore = 500; // Increased from 100 to 500
          const levelBonus = explosion.level ? explosion.level * 50 : 0;
          addScore(baseScore + levelBonus);
        }
      });
    });
  });

  return (
    <group>
      {explosions.map(explosion => (
        <CinematicExplosion key={explosion.id} explosion={explosion} />
      ))}
    </group>
  );
};

export default Explosions; 