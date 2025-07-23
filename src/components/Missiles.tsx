import { useFrame } from '@react-three/fiber';
import { useGameStore, type Missile } from '../store/gameStore';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import COLORS from '../theme/colors';
import { soundManager } from '../utils/soundManager';

const RealisticMissile = ({ missile }: { missile: Missile }) => {
  const missileGroupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const noseRef = useRef<THREE.Mesh>(null);
  const finRef = useRef<THREE.Group>(null);
  const mainTrailRef = useRef<THREE.Mesh>(null);
  const secondaryTrailRef = useRef<THREE.Mesh>(null);
  const exhaustRef = useRef<THREE.Group>(null);
  const heatDistortionRef = useRef<THREE.Mesh>(null);
  
  // Create realistic missile texture
  const missileTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    // Missile body base
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 256, 64);
    
    // Add metallic panels
    for (let i = 0; i < 8; i++) {
      const x = i * 32;
      ctx.fillStyle = i % 2 === 0 ? '#3a3a3a' : '#1a1a1a';
      ctx.fillRect(x, 0, 32, 64);
      
      // Panel rivets
      ctx.fillStyle = '#555';
      ctx.fillRect(x + 2, 8, 2, 2);
      ctx.fillRect(x + 2, 54, 2, 2);
      ctx.fillRect(x + 28, 8, 2, 2);
      ctx.fillRect(x + 28, 54, 2, 2);
    }
    
    // Warning stripes
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(0, 28, 256, 8);
    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * 16, 28, 16, 8);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }, []);
  
  useFrame(() => {
    if (!missileGroupRef.current || !bodyRef.current) return;
    
    const currentTime = Date.now();
    const elapsed = (currentTime - missile.startTime) / 1000;
    const progress = Math.min(elapsed * missile.speed / 10, 1);
    
    // Enhanced parabolic arc with realistic physics
    const startX = missile.x;
    const startY = 10;
    const endX = missile.targetX;
    const endY = missile.targetY;
    
    // Create more realistic ballistic trajectory
    const midX = (startX + endX) / 2;
    const midY = Math.max(startY, endY) + 2 + Math.abs(endX - startX) * 0.15; // Reduced arc height
    
    const currentX = (1 - progress) * (1 - progress) * startX + 
                    2 * (1 - progress) * progress * midX + 
                    progress * progress * endX;
                    
    const currentY = (1 - progress) * (1 - progress) * startY + 
                    2 * (1 - progress) * progress * midY + 
                    progress * progress * endY;
    
    // Calculate velocity for realistic orientation
    const prevProgress = Math.max(0, progress - 0.008);
    const prevX = (1 - prevProgress) * (1 - prevProgress) * startX + 
                  2 * (1 - prevProgress) * prevProgress * midX + 
                  prevProgress * prevProgress * endX;
    const prevY = (1 - prevProgress) * (1 - prevProgress) * startY + 
                  2 * (1 - prevProgress) * prevProgress * midY + 
                  prevProgress * prevProgress * endY;
    
    const velocityX = currentX - prevX;
    const velocityY = currentY - prevY;
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const angle = Math.atan2(velocityY, velocityX) - Math.PI / 2;
    
    // Position missile
    missileGroupRef.current.position.set(currentX, currentY, 0);
    missileGroupRef.current.rotation.z = angle;
    
    // Add realistic missile spin (reduced)
    const spinSpeed = 0.05 + velocity * 1;
    bodyRef.current.rotation.x = currentTime * 0.0005 * spinSpeed;
    
    // Slight wobble for realism (reduced)
    const wobble = Math.sin(currentTime * 0.002) * 0.01 * velocity;
    missileGroupRef.current.rotation.z += wobble;
    
    // Animate exhaust intensity based on velocity
    const exhaustIntensity = 0.4 + velocity * 4 + Math.sin(currentTime * 0.015) * 0.2;
    
    if (mainTrailRef.current?.material instanceof THREE.Material) {
      (mainTrailRef.current.material as any).emissiveIntensity = exhaustIntensity;
    }
    
    if (secondaryTrailRef.current?.material instanceof THREE.Material) {
      (secondaryTrailRef.current.material as any).emissiveIntensity = exhaustIntensity * 0.6;
    }
    
    // Animate heat distortion
    if (heatDistortionRef.current) {
      const distortionScale = 1 + Math.sin(currentTime * 0.01) * 0.2;
      heatDistortionRef.current.scale.setScalar(distortionScale);
    }
    
    // Animate exhaust particles
    if (exhaustRef.current) {
      exhaustRef.current.children.forEach((particle, i) => {
        const particleOffset = Math.sin(currentTime * 0.008 + i) * 0.05;
        particle.position.y = -0.4 - i * 0.08 + particleOffset;
        particle.scale.setScalar(1 + Math.sin(currentTime * 0.015 + i) * 0.15);
      });
    }
    
    // Update missile position in store
    missile.x = currentX;
    missile.y = currentY;
  });
  
  return (
    <group ref={missileGroupRef}>
      {/* Main missile body - properly scaled */}
      <mesh ref={bodyRef} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 12]} />
        <meshStandardMaterial 
          map={missileTexture}
          metalness={0.9}
          roughness={0.2}
          emissive="#0a0000"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Missile nose cone - sharp and aerodynamic */}
      <mesh ref={noseRef} position={[0, 0.25, 0]} castShadow>
        <coneGeometry args={[0.03, 0.15, 12]} />
        <meshStandardMaterial 
          color="#222"
          metalness={0.8}
          roughness={0.1}
          emissive={COLORS.burntSienna}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Missile fins - smaller and more realistic */}
      <group ref={finRef}>
        {Array.from({ length: 4 }, (_, i) => (
          <mesh 
            key={i}
            position={[
              Math.cos((i / 4) * Math.PI * 2) * 0.04,
              -0.15,
              Math.sin((i / 4) * Math.PI * 2) * 0.04
            ]}
            rotation={[0, (i / 4) * Math.PI * 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.01, 0.1, 0.05]} />
            <meshStandardMaterial 
              color="#333"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
      
      {/* Main exhaust trail - realistic rocket exhaust */}
      <mesh ref={mainTrailRef} position={[0, -0.35, 0]}>
        <coneGeometry args={[0.04, 1.2, 8]} />
        <meshStandardMaterial 
          color={COLORS.saffron}
          transparent
          opacity={0.9}
          emissive={COLORS.saffron}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Secondary exhaust trail - outer flame */}
      <mesh ref={secondaryTrailRef} position={[0, -0.35, 0]}>
        <coneGeometry args={[0.06, 1.5, 6]} />
        <meshStandardMaterial 
          color={COLORS.burntSienna}
          transparent
          opacity={0.5}
          emissive={COLORS.burntSienna}
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Heat distortion effect */}
      <mesh ref={heatDistortionRef} position={[0, -0.7, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial 
          color="#ff6600"
          transparent
          opacity={0.08}
          emissive="#ff4400"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Exhaust particles - smaller and more realistic */}
      <group ref={exhaustRef}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh 
            key={i}
            position={[
              (Math.random() - 0.5) * 0.08,
              -0.4 - i * 0.08,
              (Math.random() - 0.5) * 0.08
            ]}
          >
            <sphereGeometry args={[0.01 + Math.random() * 0.01, 6, 6]} />
            <meshStandardMaterial 
              color={i < 2 ? "#ffffff" : COLORS.saffron}
              emissive={i < 2 ? "#ffffff" : COLORS.saffron}
              emissiveIntensity={1.2 - i * 0.15}
              transparent
              opacity={0.8 - i * 0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Sonic boom effect (smaller) */}
      <mesh position={[0, 0.1, 0]}>
        <ringGeometry args={[0.08, 0.12, 16]} />
        <meshStandardMaterial 
          color={COLORS.lightCyan}
          transparent
          opacity={0.15}
          emissive={COLORS.lightCyan}
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Contrail/vapor trail - smaller */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.01, 0.025, 2, 6]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={1}
        />
      </mesh>
    </group>
  );
};

const Missiles = () => {
  const { missiles, removeMissile, destroyCity, cities, addExplosion } = useGameStore();
  
  useFrame(() => {
    const currentTime = Date.now();
    
    missiles.forEach(missile => {
      const elapsed = (currentTime - missile.startTime) / 1000;
      const progress = elapsed * missile.speed / 10;
      
      // Check if missile reached target
      if (progress >= 1) {
        // Create ground impact explosion (smaller)
        addExplosion({
          x: missile.targetX,
          y: missile.targetY,
          radius: 0,
          maxRadius: 0.96, // Reduced by 20% from 1.2 to 0.96
          startTime: currentTime,
          duration: 2500
        });
        
        // Check if missile hit a city - updated to match new grid level
        const hitCity = cities.find(city => 
          !city.destroyed && 
          Math.abs(city.x - missile.targetX) < 0.8 &&
          Math.abs(-2 - missile.targetY) < 0.8 // Updated from -4 to -2
        );
        
        if (hitCity) {
          destroyCity(hitCity.id);
          // Play city destruction sound
          soundManager.playCityDestroy();
        }
        
        removeMissile(missile.id);
      }
    });
  });

  return (
    <group>
      {missiles.map(missile => (
        <RealisticMissile key={missile.id} missile={missile} />
      ))}
    </group>
  );
};

export default Missiles; 