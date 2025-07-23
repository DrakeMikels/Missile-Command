import { useGameStore } from '../store/gameStore';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const RealisticBuilding = ({ x, destroyed, index }: { x: number; destroyed: boolean; index: number }) => {
  const buildingGroupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Responsive building scaling based on viewport
  const responsiveScale = useMemo(() => {
    // Scale buildings based on viewport width
    const baseScale = Math.min(viewport.width / 16, 1.2); // Responsive scaling
    return Math.max(baseScale, 0.6); // Minimum scale to ensure visibility
  }, [viewport.width]);
  
  // Properly scaled building properties
  const buildingProps = useMemo(() => {
    const seed = index * 2.618;
    
    // Building dimensions scaled for responsiveness
    const baseHeight = 2 + (Math.sin(seed) * 0.5 + 0.5) * 3; // Slightly shorter for bottom positioning
    const baseWidth = 0.5 + (Math.cos(seed * 1.3) * 0.5 + 0.5) * 0.6;
    const baseDepth = 0.4 + (Math.sin(seed * 1.7) * 0.5 + 0.5) * 0.5;
    
    // Apply responsive scaling
    const height = baseHeight * responsiveScale;
    const width = baseWidth * responsiveScale;
    const depth = baseDepth * responsiveScale;
    
    // Building architectural style
    const style = Math.floor((Math.sin(seed * 2.1) * 0.5 + 0.5) * 4);
    
    // Create procedural textures using Three.js
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Building texture based on style
    let baseColor, accentColor, glassColor;
    switch(style) {
      case 0: // Modern glass tower
        baseColor = "#e8e8e8";
        accentColor = "#2c3e50";
        glassColor = "#4a90e2";
        break;
      case 1: // Corporate steel
        baseColor = "#c0c0c0";
        accentColor = "#708090";
        glassColor = "#1e3a8a";
        break;
      case 2: // Modern mixed-use
        baseColor = "#f0f0f0";
        accentColor = "#4682b4";
        glassColor = "#00bcd4";
        break;
      default: // Residential
        baseColor = "#f5f5dc";
        accentColor = "#8b4513";
        glassColor = "#ff8c00";
    }
    
    // Create building facade texture
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add window grid
    const windowRows = Math.floor(height * 10); // Adjusted for new scale
    const windowCols = Math.floor(width * 12);
    
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        const windowX = (col / windowCols) * 512;
        const windowY = (row / windowRows) * 512;
        const windowWidth = 512 / windowCols * 0.7;
        const windowHeight = 512 / windowRows * 0.8;
        
        // Window frame
        ctx.fillStyle = accentColor;
        ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
        
        // Glass
        const isLit = Math.sin(seed + row * 0.7 + col * 1.3) > 0.1;
        ctx.fillStyle = isLit ? '#fff8dc' : glassColor;
        ctx.fillRect(
          windowX + windowWidth * 0.1, 
          windowY + windowHeight * 0.1, 
          windowWidth * 0.8, 
          windowHeight * 0.8
        );
      }
    }
    
    const buildingTexture = new THREE.CanvasTexture(canvas);
    buildingTexture.wrapS = THREE.RepeatWrapping;
    buildingTexture.wrapT = THREE.RepeatWrapping;
    
    // Create normal map for depth
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = 512;
    normalCanvas.height = 512;
    const normalCtx = normalCanvas.getContext('2d')!;
    
    // Create subtle normal map
    normalCtx.fillStyle = '#8080ff'; // Neutral normal
    normalCtx.fillRect(0, 0, 512, 512);
    
    // Add window depth
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        const windowX = (col / windowCols) * 512;
        const windowY = (row / windowRows) * 512;
        const windowWidth = 512 / windowCols * 0.7;
        const windowHeight = 512 / windowRows * 0.8;
        
        normalCtx.fillStyle = '#6060ff'; // Inset windows
        normalCtx.fillRect(
          windowX + windowWidth * 0.1, 
          windowY + windowHeight * 0.1, 
          windowWidth * 0.8, 
          windowHeight * 0.8
        );
      }
    }
    
    const normalMap = new THREE.CanvasTexture(normalCanvas);
    
    const hasSpire = Math.sin(seed * 3.1) > 0.6;
    const isStepPyramid = style === 2;
    
    return { 
      height, width, depth, style, baseColor, accentColor, glassColor,
      hasSpire, isStepPyramid, buildingTexture, normalMap, seed 
    };
  }, [index, responsiveScale]);

  // Smooth destruction animation
  useFrame(() => {
    if (buildingGroupRef.current && destroyed) {
      const time = Date.now() * 0.001;
      buildingGroupRef.current.rotation.z = Math.sin(time) * 0.05;
      buildingGroupRef.current.position.y = -2.8 + buildingProps.height / 2 - Math.sin(time * 2) * 0.05;
    }
  });

  // Create building tier with realistic materials
  const createBuildingTier = (tierWidth: number, tierHeight: number, tierDepth: number, yPos: number) => (
    <group position={[0, yPos, 0]}>
      {/* Main structure with texture */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[tierWidth, tierHeight, tierDepth]} />
        <meshStandardMaterial 
          map={buildingProps.buildingTexture}
          normalMap={buildingProps.normalMap}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      
      {/* Subtle glass overlay */}
      <mesh position={[0, 0, tierDepth / 2 + 0.002]}>
        <boxGeometry args={[tierWidth * 0.98, tierHeight * 0.98, 0.01]} />
        <meshStandardMaterial 
          color={buildingProps.glassColor}
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Structural columns */}
      {Array.from({ length: Math.floor(tierWidth * 4) + 1 }, (_, i) => (
        <mesh 
          key={`column-${i}`}
          position={[
            (i - Math.floor(tierWidth * 4) / 2) * (tierWidth / Math.floor(tierWidth * 4)),
            0,
            tierDepth / 2 + 0.001
          ]}
        >
          <boxGeometry args={[0.01, tierHeight, 0.005]} />
          <meshStandardMaterial 
            color={buildingProps.accentColor}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );

  // Position buildings on top of the grid floor at y: -2
  const buildingY = -2 + buildingProps.height / 2; // Moved down from -1.2 to -2.8 (1.6 units lower)

  return (
    <group ref={buildingGroupRef} position={[x, buildingY, 0]}>
      {!destroyed ? (
        <>
          {/* Main building structure */}
          {buildingProps.isStepPyramid ? (
            // Stepped building
            <>
              {createBuildingTier(
                buildingProps.width, 
                buildingProps.height * 0.6, 
                buildingProps.depth, 
                -buildingProps.height * 0.2
              )}
              {createBuildingTier(
                buildingProps.width * 0.8, 
                buildingProps.height * 0.3, 
                buildingProps.depth * 0.8, 
                buildingProps.height * 0.2
              )}
              {createBuildingTier(
                buildingProps.width * 0.6, 
                buildingProps.height * 0.1, 
                buildingProps.depth * 0.6, 
                buildingProps.height * 0.35
              )}
            </>
          ) : (
            // Standard tower
            createBuildingTier(buildingProps.width, buildingProps.height, buildingProps.depth, 0)
          )}
          
          {/* Architectural spire */}
          {buildingProps.hasSpire && (
            <group position={[0, buildingProps.height / 2, 0]}>
              {/* Spire base */}
              <mesh position={[0, 0.1 * responsiveScale, 0]} castShadow>
                <cylinderGeometry args={[buildingProps.width * 0.3, buildingProps.width * 0.4, 0.2 * responsiveScale, 8]} />
                <meshStandardMaterial 
                  color={buildingProps.accentColor}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              
              {/* Spire */}
              <mesh position={[0, 0.35 * responsiveScale, 0]} castShadow>
                <coneGeometry args={[buildingProps.width * 0.15, 0.5 * responsiveScale, 8]} />
                <meshStandardMaterial 
                  color={buildingProps.accentColor}
                  metalness={0.95}
                  roughness={0.05}
                />
              </mesh>
              
              {/* Antenna */}
              <mesh position={[0, 0.7 * responsiveScale, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.3 * responsiveScale]} />
                <meshStandardMaterial 
                  color="#ff0000"
                  emissive="#ff0000"
                  emissiveIntensity={0.5}
                />
              </mesh>
            </group>
          )}
          
          {/* Rooftop details */}
          <group position={[0, buildingProps.height / 2 + 0.05 * responsiveScale, 0]}>
            {/* HVAC units */}
            {Array.from({ length: Math.floor(buildingProps.width * 3) + 1 }, (_, i) => (
              <mesh 
                key={`hvac-${i}`}
                position={[
                  (i - Math.floor(buildingProps.width * 3) / 2) * (0.2 * responsiveScale),
                  0.08 * responsiveScale,
                  (Math.sin(i) * 0.2) * buildingProps.depth * 0.3
                ]}
                castShadow
              >
                <boxGeometry args={[0.12 * responsiveScale, 0.15 * responsiveScale, 0.1 * responsiveScale]} />
                <meshStandardMaterial 
                  color="#555" 
                  metalness={0.3}
                  roughness={0.8}
                />
              </mesh>
            ))}
            
            {/* Helipad for tall buildings */}
            {buildingProps.height > 3 * responsiveScale && (
              <mesh position={[0, 0.03 * responsiveScale, 0]}>
                <cylinderGeometry args={[buildingProps.width * 0.3, buildingProps.width * 0.3, 0.04 * responsiveScale]} />
                <meshStandardMaterial 
                  color="#ff4444"
                  emissive="#ff2222"
                  emissiveIntensity={0.3}
                />
              </mesh>
            )}
          </group>
          
          {/* Building base */}
          <group position={[0, -buildingProps.height / 2, 0]}>
            {/* Lobby */}
            <mesh position={[0, 0.2 * responsiveScale, buildingProps.depth / 2 + 0.05 * responsiveScale]} castShadow>
              <boxGeometry args={[buildingProps.width * 1.02, 0.4 * responsiveScale, 0.12 * responsiveScale]} />
              <meshStandardMaterial 
                color={buildingProps.baseColor}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            
            {/* Entrance */}
            <mesh position={[0, 0.1 * responsiveScale, buildingProps.depth / 2 + 0.12 * responsiveScale]}>
              <boxGeometry args={[buildingProps.width * 0.4, 0.2 * responsiveScale, 0.02 * responsiveScale]} />
              <meshStandardMaterial 
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
          
        </>
      ) : (
        // Realistic destruction
        <>
          {/* Collapsed structure */}
          <mesh position={[0, -buildingProps.height / 3, 0]} receiveShadow>
            <boxGeometry args={[
              buildingProps.width * 1.2, 
              buildingProps.height * 0.2, 
              buildingProps.depth * 1.1
            ]} />
            <meshStandardMaterial 
              color="#4a4a4a"
              roughness={1}
              metalness={0}
            />
          </mesh>
          
          {/* Fire effects */}
          {Array.from({ length: 3 }, (_, i) => (
            <mesh 
              key={`fire-${i}`}
              position={[
                (Math.random() - 0.5) * buildingProps.width,
                -buildingProps.height / 4 + Math.random() * buildingProps.height * 0.2,
                (Math.random() - 0.5) * buildingProps.depth
              ]}
            >
              <sphereGeometry args={[(0.15 + Math.random() * 0.2) * responsiveScale, 8, 8]} />
              <meshStandardMaterial 
                color="#ff6600"
                emissive="#ff4400"
                emissiveIntensity={1.2}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
          
          {/* Debris */}
          {Array.from({ length: 6 }, (_, i) => (
            <mesh 
              key={`debris-${i}`}
              position={[
                (Math.random() - 0.5) * buildingProps.width * 2,
                -buildingProps.height / 3 + Math.random() * 0.3,
                (Math.random() - 0.5) * buildingProps.depth * 2
              ]}
              rotation={[
                Math.random() * Math.PI, 
                Math.random() * Math.PI, 
                Math.random() * Math.PI
              ]}
              castShadow
            >
              <boxGeometry args={[
                (0.1 + Math.random() * 0.2) * responsiveScale,
                (0.05 + Math.random() * 0.15) * responsiveScale,
                (0.08 + Math.random() * 0.15) * responsiveScale
              ]} />
              <meshStandardMaterial 
                color="#666"
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

const Cities = () => {
  const cities = useGameStore(state => state.cities);
  const { viewport } = useThree();

  // Responsive ground and road scaling
  const responsiveScale = useMemo(() => {
    return Math.min(viewport.width / 16, 1.2);
  }, [viewport.width]);

  // Create ground texture
  const groundTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Dark urban ground
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add subtle concrete texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 3;
      ctx.fillStyle = `rgba(${20 + Math.random() * 20}, ${20 + Math.random() * 20}, ${20 + Math.random() * 20}, 0.3)`;
      ctx.fillRect(x, y, size, size);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    
    return texture;
  }, []);

  // Create road texture
  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Asphalt base
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add asphalt texture
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2;
      ctx.fillStyle = `rgba(${10 + Math.random() * 30}, ${10 + Math.random() * 30}, ${10 + Math.random() * 30}, 0.4)`;
      ctx.fillRect(x, y, size, size);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 2);
    
    return texture;
  }, []);

  return (
    <group>
      {/* Responsive urban foundation - positioned below grid floor */}
      <mesh position={[0, -2.5, 0]} receiveShadow>
        <boxGeometry args={[Math.max(25, viewport.width * 2), 1, 8]} />
        <meshStandardMaterial 
          map={groundTexture}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Responsive road system - positioned on grid floor level */}
      <mesh position={[0, -1.95, 2]} receiveShadow>
        <boxGeometry args={[Math.max(22, viewport.width * 1.8), 0.05, 1.5]} />
        <meshStandardMaterial 
          map={roadTexture}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>
      
      {/* Responsive lane dividers - positioned on road level */}
      {Array.from({ length: Math.max(8, Math.floor(viewport.width)) }, (_, i) => (
        <mesh 
          key={`divider-${i}`}
          position={[
            (-viewport.width + (i * (viewport.width * 2) / Math.max(8, Math.floor(viewport.width)))), 
            -1.92, 
            2
          ]} 
          receiveShadow
        >
          <boxGeometry args={[1.2 * responsiveScale, 0.01, 0.08]} />
          <meshStandardMaterial 
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Responsive buildings */}
      {cities.map((city, index) => (
        <RealisticBuilding
          key={city.id}
          x={city.x}
          destroyed={city.destroyed}
          index={index}
        />
      ))}

      {/* Atmospheric particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh 
          key={`atmosphere-${i}`}
          position={[
            (Math.random() - 0.5) * viewport.width * 2,
            Math.random() * 8,
            (Math.random() - 0.5) * 10
          ]}
        >
          <sphereGeometry args={[0.005 * responsiveScale, 4, 4]} />
          <meshStandardMaterial 
            color="#87ceeb"
            emissive="#87ceeb"
            emissiveIntensity={0.3}
            transparent
            opacity={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Cities; 