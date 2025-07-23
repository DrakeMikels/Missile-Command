import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, FXAAEffect, ToneMappingEffect, VignetteEffect } from 'postprocessing';
import { useEffect, useState } from 'react';
import { ToneMappingMode } from 'postprocessing';

export function AdvancedEffects() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const [composer] = useState(() => new EffectComposer(gl, { multisampling: 0 }));

  useEffect(() => composer.setSize(size.width, size.height), [composer, size]);
  
  useEffect(() => {
    try {
      const renderPass = new RenderPass(scene, camera);
      
      // Enhanced bloom effect (matching sphere physics settings)
      const bloomEffect = new BloomEffect({ 
        mipmapBlur: true, 
        luminanceThreshold: 0.1, 
        intensity: 1.2, // Slightly higher for game atmosphere
        levels: 7,
        kernelSize: 5,
        luminanceSmoothing: 0.025
      });
      
      // FXAA anti-aliasing for clean edges
      const fxaaEffect = new FXAAEffect();
      
      // Advanced tone mapping for cinematic look
      const toneMappingEffect = new ToneMappingEffect({
        mode: ToneMappingMode.ACES_FILMIC,
        resolution: 256,
        whitePoint: 4.0,
        middleGrey: 0.6,
        minLuminance: 0.01,
        averageLuminance: 1.0,
        adaptationRate: 2.0
      });
      
      // Subtle vignette for cinematic framing
      const vignetteEffect = new VignetteEffect({
        offset: 0.35,
        darkness: 0.4,
        eskil: false
      });

      composer.addPass(renderPass);
      composer.addPass(new EffectPass(camera, bloomEffect, toneMappingEffect, vignetteEffect));
      composer.addPass(new EffectPass(camera, fxaaEffect));

      return () => {
        composer.removeAllPasses();
      };
    } catch (error) {
      console.warn('Advanced Effects initialization failed, falling back to basic effects:', error);
      // Fallback to basic effects
      const renderPass = new RenderPass(scene, camera);
      const bloomEffect = new BloomEffect({ 
        mipmapBlur: true, 
        luminanceThreshold: 0.15, 
        intensity: 1.0, 
        levels: 5 
      });
      const fxaaEffect = new FXAAEffect();
      
      composer.addPass(renderPass);
      composer.addPass(new EffectPass(camera, bloomEffect));
      composer.addPass(new EffectPass(camera, fxaaEffect));
      
      return () => {
        composer.removeAllPasses();
      };
    }
  }, [composer, camera, scene]);

  useFrame((_, delta) => {
    try {
      gl.autoClear = true;
      composer.render(delta);
    } catch (error) {
      // Fallback to basic rendering if composer fails
      console.warn('Composer render failed, falling back to basic rendering:', error);
      gl.render(scene, camera);
    }
  }, 1);

  return null;
} 