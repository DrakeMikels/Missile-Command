import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import COLORS from '../theme/colors';

const RetroStarfield = () => {
  const starfieldRef = useRef<THREE.Points>(null);
  
  const starData = useMemo(() => {
    const count = 1600; // Increased by 100% from 800 to 1600
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinklePhases = new Float32Array(count); // For twinkling effect
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Distribute stars across the sky
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = Math.random() * 100 + 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;
      
      // Multi-colored stars like the reference
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i3] = 1.0;     // R - Red stars
        colors[i3 + 1] = 0.2; // G
        colors[i3 + 2] = 0.2; // B
      } else if (colorChoice < 0.6) {
        colors[i3] = 1.0;     // R - Yellow stars
        colors[i3 + 1] = 1.0; // G
        colors[i3 + 2] = 0.2; // B
      } else if (colorChoice < 0.8) {
        colors[i3] = 0.2;     // R - Blue stars
        colors[i3 + 1] = 0.6; // G
        colors[i3 + 2] = 1.0; // B
      } else {
        colors[i3] = 1.0;     // R - White stars
        colors[i3 + 1] = 1.0; // G
        colors[i3 + 2] = 1.0; // B
      }
      
      sizes[i] = Math.random() * 2 + 1;
      twinklePhases[i] = Math.random() * Math.PI * 2; // Random phase for each star
    }
    
    return { positions, colors, sizes, twinklePhases, count };
  }, []);
  
  useFrame((state) => {
    if (starfieldRef.current) {
      const time = state.clock.elapsedTime;
      starfieldRef.current.rotation.y = time * 0.002;
      
      // Animate star twinkling
      const sizeAttribute = starfieldRef.current.geometry.attributes.size;
      if (sizeAttribute) {
        const sizes = sizeAttribute.array as Float32Array;
        
        for (let i = 0; i < starData.count; i++) {
          // Create twinkling effect with different speeds for each star
          const twinkleSpeed = 1.5 + Math.sin(starData.twinklePhases[i]) * 0.8;
          const twinkle = Math.sin(time * twinkleSpeed + starData.twinklePhases[i]) * 0.5 + 0.5;
          
          // Base size with twinkling multiplier
          const baseSize = starData.sizes[i];
          sizes[i] = baseSize * (0.3 + twinkle * 0.7); // Twinkle between 30% and 100% of base size
        }
        
        sizeAttribute.needsUpdate = true;
      }
    }
  });
  
  return (
    <points ref={starfieldRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starData.count}
          array={starData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starData.count}
          array={starData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starData.count}
          array={starData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={false}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const RetroGridFloor = () => {
  const gridRef = useRef<THREE.Group>(null);
  
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 512);
    
    // Grid lines
    ctx.strokeStyle = '#ff00ff'; // Magenta grid lines like the reference
    ctx.lineWidth = 2;
    
    const gridSize = 32;
    for (let i = 0; i <= 512; i += gridSize) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
  gridTexture.repeat.set(4, 4);
  
  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.elapsedTime;
      // Subtle grid animation
      gridTexture.offset.y = time * 0.02;
    }
  });
  
  return (
    <group ref={gridRef}>
      {/* Main grid floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial 
          map={gridTexture}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Perspective grid extending into distance */}
      <mesh position={[0, -1.9, -50]} rotation={[-Math.PI / 2.2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 100]} />
        <meshBasicMaterial 
          map={gridTexture}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

const RetroSkybox = () => {
  const skyTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Create the classic 80s gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#000011');    // Deep space blue
    gradient.addColorStop(0.3, '#001122');  // Dark blue
    gradient.addColorStop(0.5, '#002244');  // Blue
    gradient.addColorStop(0.7, '#003366');  // Lighter blue
    gradient.addColorStop(0.85, '#4400aa'); // Purple
    gradient.addColorStop(0.95, '#aa0066'); // Magenta
    gradient.addColorStop(1, '#ff0088');    // Pink horizon
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 32, 32]} />
      <meshBasicMaterial map={skyTexture} side={THREE.BackSide} />
    </mesh>
  );
};

const RetroHorizonGlow = () => {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      const time = state.clock.elapsedTime;
      const intensity = 0.3 + Math.sin(time * 0.5) * 0.1;
      if (glowRef.current.material instanceof THREE.Material) {
        (glowRef.current.material as any).opacity = intensity;
      }
    }
  });
  
  return (
    <mesh ref={glowRef} position={[0, -1, -100]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[400, 50]} />
      <meshBasicMaterial 
        color="#ff0088"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Floating particles in the scene
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = Math.random() * 30 + 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 80;
      
      // 80s neon colors
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i3] = 1.0;     // R - Cyan
        colors[i3 + 1] = 0.0; // G
        colors[i3 + 2] = 1.0; // B
      } else if (colorChoice < 0.7) {
        colors[i3] = 0.0;     // R - Magenta
        colors[i3 + 1] = 1.0; // G
        colors[i3 + 2] = 1.0; // B
      } else {
        colors[i3] = 1.0;     // R - Yellow
        colors[i3 + 1] = 1.0; // G
        colors[i3 + 2] = 0.0; // B
      }
      
      sizes[i] = Math.random() * 3 + 1;
    }
    
    return { positions, colors, sizes, count };
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleData.count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 0.3 + i * 0.01) * 0.005;
        positions[i3] += Math.cos(time * 0.2 + i * 0.02) * 0.003;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.count}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleData.count}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleData.count}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const AdvancedBackground = () => {
  return (
    <group>
      <RetroSkybox />
      <RetroStarfield />
      <RetroGridFloor />
      <RetroHorizonGlow />
      <FloatingParticles />
    </group>
  );
};

export default AdvancedBackground; 