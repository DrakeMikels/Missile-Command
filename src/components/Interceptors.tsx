import { useFrame } from '@react-three/fiber';
import { useGameStore, type Interceptor } from '../store/gameStore';
import { useRef } from 'react';
import * as THREE from 'three';
import COLORS from '../theme/colors';

const InterceptorProjectile = ({ interceptor }: { interceptor: Interceptor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current || !trailRef.current || !glowRef.current) return;
    
    const currentTime = Date.now();
    const elapsed = (currentTime - interceptor.startTime) / 1000;
    const distance = Math.sqrt(
      Math.pow(interceptor.targetX - interceptor.startX, 2) + 
      Math.pow(interceptor.targetY - interceptor.startY, 2)
    );
    const travelTime = distance / interceptor.speed;
    const progress = Math.min(elapsed / travelTime, 1);
    
    // Linear interpolation to target
    const currentX = interceptor.startX + (interceptor.targetX - interceptor.startX) * progress;
    const currentY = interceptor.startY + (interceptor.targetY - interceptor.startY) * progress;
    
    const position = new THREE.Vector3(currentX, currentY, 0);
    meshRef.current.position.copy(position);
    trailRef.current.position.copy(position);
    glowRef.current.position.copy(position);
    
    // Calculate direction for orientation
    const direction = new THREE.Vector3(
      interceptor.targetX - interceptor.startX,
      interceptor.targetY - interceptor.startY,
      0
    ).normalize();
    const angle = Math.atan2(direction.y, direction.x) - Math.PI / 2;
    
    meshRef.current.rotation.z = angle;
    trailRef.current.rotation.z = angle;
    
    // Animate trail intensity
    const intensity = 0.6 + Math.sin(currentTime * 0.015) * 0.4;
    if (trailRef.current.material instanceof THREE.Material) {
      (trailRef.current.material as any).emissiveIntensity = intensity;
    }
    
    // Animate glow pulsing
    const glowScale = 1 + Math.sin(currentTime * 0.02) * 0.3;
    glowRef.current.scale.setScalar(glowScale);
  });
  
  return (
    <group>
      {/* Interceptor body - sleek design */}
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.03, 0.06, 0.25, 6]} />
        <meshStandardMaterial 
          color={COLORS.persianGreen}
          metalness={0.9}
          roughness={0.1}
          emissive={COLORS.persianGreen}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Interceptor nose */}
      <mesh ref={meshRef}>
        <coneGeometry args={[0.03, 0.1, 6]} />
        <meshStandardMaterial 
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Enhanced trail with more realistic exhaust */}
      <mesh ref={trailRef}>
        <cylinderGeometry args={[0.01, 0.04, 0.8, 6]} />
        <meshStandardMaterial 
          color={COLORS.persianGreen}
          transparent
          opacity={0.7}
          emissive={COLORS.persianGreen}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Secondary trail for depth */}
      <mesh ref={trailRef}>
        <cylinderGeometry args={[0.005, 0.02, 1.2, 4]} />
        <meshStandardMaterial 
          color={COLORS.lightCyan}
          transparent
          opacity={0.5}
          emissive={COLORS.lightCyan}
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Glow aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial 
          color={COLORS.persianGreen}
          transparent
          opacity={0.1}
          emissive={COLORS.persianGreen}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Exhaust particles */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh 
          key={i}
          ref={trailRef}
          position={[
            (Math.random() - 0.5) * 0.05,
            -0.15 - i * 0.08,
            (Math.random() - 0.5) * 0.05
          ]}
        >
          <sphereGeometry args={[0.015, 4, 4]} />
          <meshStandardMaterial 
            color={COLORS.lightCyan}
            emissive={COLORS.lightCyan}
            emissiveIntensity={0.9}
            transparent
            opacity={0.8 - i * 0.15}
          />
        </mesh>
      ))}
    </group>
  );
};

const Interceptors = () => {
  const { 
    interceptors, 
    removeInterceptor, 
    addExplosion,
    level
  } = useGameStore();
  
  useFrame(() => {
    const currentTime = Date.now();
    
    interceptors.forEach(interceptor => {
      if (interceptor.exploded) return;
      
      const elapsed = (currentTime - interceptor.startTime) / 1000;
      const distance = Math.sqrt(
        Math.pow(interceptor.targetX - interceptor.startX, 2) + 
        Math.pow(interceptor.targetY - interceptor.startY, 2)
      );
      const travelTime = distance / interceptor.speed;
      
      // Check if interceptor reached target
      if (elapsed >= travelTime) {
        // Create enhanced explosion
        addExplosion({
          x: interceptor.targetX,
          y: interceptor.targetY,
          radius: 0,
          maxRadius: 1.41, // Reduced by 20% from 1.76 to 1.41 (total 36% reduction from original)
          startTime: currentTime,
          duration: 2500, // Longer duration for better visuals
          level: level // Add level for scoring bonuses
        });
        
        // Mark as exploded and remove
        removeInterceptor(interceptor.id);
      }
    });
  });

  return (
    <group>
      {interceptors
        .filter(interceptor => !interceptor.exploded)
        .map(interceptor => (
          <InterceptorProjectile key={interceptor.id} interceptor={interceptor} />
        ))}
    </group>
  );
};

export default Interceptors; 