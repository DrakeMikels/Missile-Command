import { create } from 'zustand';
import { soundManager } from '../utils/soundManager';

export interface City {
  id: string;
  x: number;
  destroyed: boolean;
}

export interface Missile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  startTime: number;
}

export interface Interceptor {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  speed: number;
  startTime: number;
  exploded: boolean;
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  startTime: number;
  duration: number;
  level?: number;
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: 'scoreMultiplier' | 'shield' | 'rapidFire';
  value: number;
  startTime: number;
  collected: boolean;
}

interface GameState {
  // Game state
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  level: number;
  lives: number;
  scoreMultiplier: number;
  
  // Game objects
  cities: City[];
  missiles: Missile[];
  interceptors: Interceptor[];
  explosions: Explosion[];
  powerUps: PowerUp[];
  
  // Actions
  startGame: () => void;
  endGame: () => void;
  addScore: (points: number) => void;
  nextLevel: () => void;
  setScoreMultiplier: (multiplier: number) => void;
  
  // Object management
  addMissile: (missile: Omit<Missile, 'id'>) => void;
  removeMissile: (id: string) => void;
  addInterceptor: (interceptor: Omit<Interceptor, 'id'>) => void;
  removeInterceptor: (id: string) => void;
  addExplosion: (explosion: Omit<Explosion, 'id'>) => void;
  removeExplosion: (id: string) => void;
  destroyCity: (id: string) => void;
  addPowerUp: (powerUp: Omit<PowerUp, 'id'>) => void;
  removePowerUp: (id: string) => void;
  collectPowerUp: (id: string) => void;
  
  // Game loop
  updateGame: (deltaTime: number) => void;
}

const createInitialCities = (): City[] => {
  const cityCount = 6;
  const cities: City[] = [];
  
  // Mobile-first responsive positioning
  // Use a safe zone to ensure all cities are visible on narrow screens
  const safeZoneWidth = 10; // Conservative width that works on most mobile devices
  const edgePadding = 1; // Padding from screen edges
  const usableWidth = safeZoneWidth - (edgePadding * 2);
  const spacing = usableWidth / (cityCount - 1); // Space between cities
  
  for (let i = 0; i < cityCount; i++) {
    cities.push({
      id: `city-${i}`,
      x: (i * spacing) - (usableWidth / 2), // Evenly distributed from -4 to +4
      destroyed: false,
    });
  }
  
  return cities;
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  gameState: 'menu',
  score: 0,
  level: 1,
  lives: 3,
  scoreMultiplier: 1,
  cities: createInitialCities(),
  missiles: [],
  interceptors: [],
  explosions: [],
  powerUps: [],
  
  // Actions
  startGame: () => set({ 
    gameState: 'playing', 
    score: 0, 
    level: 1, 
    lives: 3,
    scoreMultiplier: 1,
    cities: createInitialCities(),
    missiles: [],
    interceptors: [],
    explosions: [],
    powerUps: []
  }),
  
  endGame: () => {
    soundManager.playGameOver();
    set({ gameState: 'gameOver' });
  },
  
  addScore: (points: number) => set((state) => ({ 
    score: state.score + Math.floor(points * state.scoreMultiplier)
  })),
  
  setScoreMultiplier: (multiplier: number) => set({ scoreMultiplier: multiplier }),
  
  nextLevel: () => set((state) => ({ 
    level: state.level + 1,
    missiles: [],
    interceptors: [],
    explosions: [],
    powerUps: []
  })),
  
  // Object management
  addMissile: (missile) => set((state) => ({
    missiles: [...state.missiles, { ...missile, id: `missile-${Date.now()}-${Math.random()}` }]
  })),
  
  removeMissile: (id) => set((state) => ({
    missiles: state.missiles.filter(m => m.id !== id)
  })),
  
  addInterceptor: (interceptor) => set((state) => ({
    interceptors: [...state.interceptors, { ...interceptor, id: `interceptor-${Date.now()}-${Math.random()}` }]
  })),
  
  removeInterceptor: (id) => set((state) => ({
    interceptors: state.interceptors.filter(i => i.id !== id)
  })),
  
  addExplosion: (explosion) => set((state) => ({
    explosions: [...state.explosions, { ...explosion, id: `explosion-${Date.now()}-${Math.random()}` }]
  })),
  
  removeExplosion: (id) => set((state) => ({
    explosions: state.explosions.filter(e => e.id !== id)
  })),
  
  destroyCity: (id) => set((state) => ({
    cities: state.cities.map(city => 
      city.id === id ? { ...city, destroyed: true } : city
    )
  })),
  
  addPowerUp: (powerUp) => set((state) => ({
    powerUps: [...state.powerUps, { ...powerUp, id: `powerup-${Date.now()}-${Math.random()}` }]
  })),
  
  removePowerUp: (id) => set((state) => ({
    powerUps: state.powerUps.filter(p => p.id !== id)
  })),
  
  collectPowerUp: (id) => set((state) => {
    const powerUp = state.powerUps.find(p => p.id === id);
    if (!powerUp) return state;
    
    let newMultiplier = state.scoreMultiplier;
    
    switch (powerUp.type) {
      case 'scoreMultiplier':
        newMultiplier = Math.min(state.scoreMultiplier + powerUp.value, 10); // Cap at 10x
        // Reset multiplier after 15 seconds
        setTimeout(() => {
          set((currentState) => ({ scoreMultiplier: Math.max(currentState.scoreMultiplier - powerUp.value, 1) }));
        }, 15000);
        break;
      case 'shield':
        // TODO: Implement shield logic
        break;
      case 'rapidFire':
        // TODO: Implement rapid fire logic
        break;
    }
    
    return {
      powerUps: state.powerUps.map(p => p.id === id ? { ...p, collected: true } : p),
      scoreMultiplier: newMultiplier
    };
  }),
  
  // Game loop
  updateGame: (_deltaTime: number) => {
    const state = get();
    
    // Check if all cities are destroyed
    const activeCities = state.cities.filter(city => !city.destroyed);
    if (activeCities.length === 0 && state.gameState === 'playing') {
      state.endGame();
      return;
    }
    
    // Remove expired explosions
    const currentTime = Date.now();
    const expiredExplosions = state.explosions.filter(
      explosion => currentTime - explosion.startTime > explosion.duration
    );
    
    expiredExplosions.forEach(explosion => {
      state.removeExplosion(explosion.id);
    });
  }
})); 