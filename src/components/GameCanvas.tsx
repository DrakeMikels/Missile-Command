import { Canvas } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import COLORS from '../theme/colors';
import Scene from './Scene';
import AdvancedBackground from './AdvancedBackground';
import { AdvancedEffects } from './AdvancedEffects';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000011',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1
    }}>
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: [0, 3, 12], // Head-on view like classic Missile Command
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false
        }}
        style={{ 
          background: 'linear-gradient(to bottom, #000011, #002244, #ff0088)',
          width: '100%',
          height: '100%'
        }}
      >
        <Suspense fallback={null}>
          {/* Retro 80s Background */}
          <AdvancedBackground />
          
          {/* Retro Lighting Setup */}
          <ambientLight intensity={0.3} color="#ff0088" />
          
          {/* Main neon light */}
          <directionalLight 
            position={[0, 15, -8]} 
            intensity={2.5}
            color="#00ffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={60}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={20}
            shadow-camera-bottom={-5}
            shadow-bias={-0.0001}
          />
          
          {/* Neon accent lights */}
          <directionalLight 
            position={[-8, 10, 8]} 
            intensity={1.0}
            color="#ff00ff"
          />
          
          <directionalLight 
            position={[8, 8, 6]} 
            intensity={0.8}
            color="#ffff00"
          />
          
          {/* Grid glow from below */}
          <pointLight 
            position={[0, -1, 2]} 
            intensity={2.0} 
            color="#ff00ff"
            distance={30}
            decay={1.5}
          />
          
          {/* Atmospheric neon lights */}
          <pointLight position={[-12, 8, 8]} intensity={1.0} color="#00ffff" distance={20} decay={2} />
          <pointLight position={[12, 6, 6]} intensity={0.8} color="#ff0088" distance={18} decay={2.2} />
          <pointLight position={[0, 12, -8]} intensity={0.6} color="#ffff00" distance={25} decay={2} />
          
          {/* Scene content */}
          <Scene />
          
          {/* Advanced Post-Processing Effects */}
          <AdvancedEffects />
          
          {/* Retro atmospheric fog */}
          <fog attach="fog" args={['#000044', 20, 100]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameCanvas; 