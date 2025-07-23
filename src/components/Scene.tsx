import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import Cities from './Cities';
import Missiles from './Missiles';
import Interceptors from './Interceptors';
import Explosions from './Explosions';
import GameManager from './GameManager';

const Scene = () => {
  const { camera, gl } = useThree();
  const lastTimeRef = useRef<number>(0);
  
  const { 
    gameState, 
    addInterceptor, 
    updateGame 
  } = useGameStore();

  // Handle click/touch to launch interceptors
  const handleClick = useCallback((event: any) => {
    if (gameState !== 'playing') return;
    
    event.stopPropagation();
    
    // Get normalized device coordinates
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Convert to world coordinates
    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const worldPosition = camera.position.clone().add(dir.multiplyScalar(distance));
    
    // Launch interceptor from bottom center to click position
    addInterceptor({
      startX: 0,
      startY: -2.5, // Launch from just below grid level
      targetX: worldPosition.x,
      targetY: worldPosition.y,
      speed: 8,
      startTime: Date.now(),
      exploded: false
    });
  }, [gameState, addInterceptor, camera, gl]);

  // Game loop
  useFrame(() => {
    const currentTime = performance.now();
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime;
      return;
    }
    
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    updateGame(deltaTime);
  });

  return (
    <group onClick={handleClick}>
      {/* Ground plane for click detection */}
      <mesh position={[0, 0, 0]} visible={false}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Game objects */}
      <Cities />
      <Missiles />
      <Interceptors />
      <Explosions />
      
      {/* Game management */}
      <GameManager />
    </group>
  );
};

export default Scene; 