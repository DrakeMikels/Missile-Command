// Sound Manager for Missile Commander
// Uses Web Audio API to generate retro arcade sounds

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private sounds: { [key: string]: AudioBuffer } = {};
  private _enabled = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      // Check if Web Audio API is available
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported in this browser');
        return;
      }
      
      this.audioContext = new AudioContextClass();
      console.log('Audio context created successfully');
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      console.log('Resuming suspended audio context...');
      try {
        await this.audioContext.resume();
        console.log('Audio context resumed successfully');
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
        throw error;
      }
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
    if (!this.audioContext) {
      console.warn('No audio context available');
      return;
    }

    try {
      await this.resumeAudioContext();

      // Test if we can create sounds
      const testBuffer = this.createExplosionSound();
      if (!testBuffer) {
        console.warn('Failed to create test sound buffer');
        return;
      }

      this.sounds = {
        explosion: this.createExplosionSound(),
        missileLaunch: this.createMissileLaunchSound(),
        interceptor: this.createInterceptorSound(),
        powerUp: this.createPowerUpSound(),
        cityDestroy: this.createCityDestroySound(),
        gameOver: this.createGameOverSound(),
        levelComplete: this.createLevelCompleteSound()
      };

      console.log('Sound system initialized successfully', {
        audioContextState: this.audioContext.state,
        soundsLoaded: Object.keys(this.sounds).length
      });
    } catch (error) {
      console.warn('Failed to initialize sound system:', error);
    }
  }

  // Play a sound with optional volume and pitch adjustment
  public async playSound(soundName: string, volume: number = 1, pitch: number = 1) {
    if (!this._enabled || !this.audioContext || !this.sounds[soundName]) return;

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

  // Enable/disable sounds
  public setEnabled(enabled: boolean) {
    this._enabled = enabled;
    console.log(`Sound system ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Get current enabled state
  public get enabled(): boolean {
    return this._enabled;
  }

  // Toggle sound on/off
  public toggle(): boolean {
    this._enabled = !this._enabled;
    console.log(`Sound system ${this._enabled ? 'enabled' : 'disabled'}`);
    return this._enabled;
  }

  // Test if sound system is working
  public async testSound() {
    if (!this.audioContext) return false;
    
    try {
      await this.resumeAudioContext();
      
      // Play a very quiet test tone
      const source = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      source.frequency.setValueAtTime(440, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime); // Very quiet
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.1);
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
      source.stop(this.audioContext.currentTime + 0.1);
      
      console.log('Sound test successful');
      return true;
    } catch (error) {
      console.warn('Sound test failed:', error);
      return false;
    }
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