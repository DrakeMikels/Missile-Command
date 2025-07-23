// Sound Manager for Missile Commander
// Uses Web Audio API to generate retro arcade sounds

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private sounds: { [key: string]: AudioBuffer } = {};

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Generate retro explosion sound
  private createExplosionSound(): AudioBuffer {
    if (!this.audioContext) return null as any;
    
    const duration = 0.8;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 3);
      
      // Multiple noise layers for rich explosion sound
      const noise1 = (Math.random() * 2 - 1) * decay;
      const noise2 = (Math.random() * 2 - 1) * decay * 0.5;
      const rumble = Math.sin(t * 60 * Math.PI * 2) * decay * 0.3;
      
      data[i] = (noise1 + noise2 + rumble) * 0.4;
    }

    return buffer;
  }

  // Generate missile launch sound
  private createMissileLaunchSound(): AudioBuffer {
    if (!this.audioContext) return null as any;
    
    const duration = 0.4;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 2);
      
      // Swoosh sound with frequency sweep
      const freq = 200 + (1 - t) * 300;
      const tone = Math.sin(t * freq * Math.PI * 2) * envelope * 0.3;
      const noise = (Math.random() * 2 - 1) * envelope * 0.1;
      
      data[i] = tone + noise;
    }

    return buffer;
  }

  // Generate interceptor launch sound
  private createInterceptorSound(): AudioBuffer {
    if (!this.audioContext) return null as any;
    
    const duration = 0.3;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 4);
      
      // Sharp, quick launch sound
      const freq = 400 + t * 200;
      const tone = Math.sin(t * freq * Math.PI * 2) * envelope;
      
      data[i] = tone * 0.25;
    }

    return buffer;
  }

  // Generate power-up collection sound
  private createPowerUpSound(): AudioBuffer {
    if (!this.audioContext) return null as any;
    
    const duration = 0.5;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 2);
      
      // Ascending tone sequence
      const freq1 = 440 * Math.pow(2, t * 2); // Rising pitch
      const freq2 = 660 * Math.pow(2, t * 1.5);
      const tone1 = Math.sin(t * freq1 * Math.PI * 2) * envelope * 0.3;
      const tone2 = Math.sin(t * freq2 * Math.PI * 2) * envelope * 0.2;
      
      data[i] = tone1 + tone2;
    }

    return buffer;
  }

  // Generate city destruction sound
  private createCityDestroySound(): AudioBuffer {
    if (!this.audioContext) return null as any;
    
    const duration = 1.2;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 1.5);
      
      // Deep rumbling destruction sound
      const noise = (Math.random() * 2 - 1) * decay;
      const rumble1 = Math.sin(t * 80 * Math.PI * 2) * decay * 0.4;
      const rumble2 = Math.sin(t * 120 * Math.PI * 2) * decay * 0.3;
      const crack = Math.sin(t * 800 * Math.PI * 2) * decay * 0.1;
      
      data[i] = (noise + rumble1 + rumble2 + crack) * 0.5;
    }

    return buffer;
  }

  // Generate game over sound
  private createGameOverSound(): AudioBuffer {
    if (!this.audioContext) return null as any;
    
    const duration = 2.0;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 0.8);
      
      // Descending dramatic tones
      const freq = 220 * Math.pow(0.5, t * 0.8);
      const tone = Math.sin(t * freq * Math.PI * 2) * envelope;
      const harmonics = Math.sin(t * freq * 2 * Math.PI * 2) * envelope * 0.3;
      
      data[i] = (tone + harmonics) * 0.4;
    }

    return buffer;
  }

  // Generate level complete sound
  private createLevelCompleteSound(): AudioBuffer {
    if (!this.audioContext) return null as any;
    
    const duration = 1.0;
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Victory fanfare
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C octave
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t * 4);
      const noteDuration = 0.25;
      const noteTime = (t % noteDuration) / noteDuration;
      const envelope = Math.exp(-noteTime * 3);
      
      if (noteIndex < notes.length) {
        const freq = notes[noteIndex];
        const tone = Math.sin(noteTime * freq * Math.PI * 2) * envelope;
        data[i] = tone * 0.3;
      }
    }

    return buffer;
  }

  // Initialize all sounds
  public async init() {
    if (!this.audioContext) return;

    await this.resumeAudioContext();

    this.sounds = {
      explosion: this.createExplosionSound(),
      missileLaunch: this.createMissileLaunchSound(),
      interceptor: this.createInterceptorSound(),
      powerUp: this.createPowerUpSound(),
      cityDestroy: this.createCityDestroySound(),
      gameOver: this.createGameOverSound(),
      levelComplete: this.createLevelCompleteSound()
    };
  }

  // Play a sound with optional volume and pitch adjustment
  public async playSound(soundName: string, volume: number = 1, pitch: number = 1) {
    if (!this.audioContext || !this.sounds[soundName]) return;

    await this.resumeAudioContext();

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = this.sounds[soundName];
    source.playbackRate.value = pitch;
    gainNode.gain.value = this.masterVolume * volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start();
  }

  // Convenience methods for specific sounds
  public playExplosion(volume: number = 1) {
    this.playSound('explosion', volume, 0.8 + Math.random() * 0.4);
  }

  public playMissileLaunch(volume: number = 0.7) {
    this.playSound('missileLaunch', volume, 0.9 + Math.random() * 0.2);
  }

  public playInterceptor(volume: number = 0.8) {
    this.playSound('interceptor', volume, 0.95 + Math.random() * 0.1);
  }

  public playPowerUp(volume: number = 1) {
    this.playSound('powerUp', volume);
  }

  public playCityDestroy(volume: number = 1) {
    this.playSound('cityDestroy', volume);
  }

  public playGameOver(volume: number = 1) {
    this.playSound('gameOver', volume);
  }

  public playLevelComplete(volume: number = 1) {
    this.playSound('levelComplete', volume);
  }

  // Set master volume
  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Initialize on first user interaction
let initialized = false;
export const initSounds = async () => {
  if (!initialized) {
    await soundManager.init();
    initialized = true;
  }
}; 