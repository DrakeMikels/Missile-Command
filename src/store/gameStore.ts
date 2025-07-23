import { create } from 'zustand';

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
}

interface GameState {
  // Game state
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  level: number;
  lives: number;
  
  // Game objects
  cities: City[];
  missiles: Missile[];
  interceptors: Interceptor[];
  explosions: Explosion[];
  
  // Actions
  startGame: () => void;
  endGame: () => void;
  addScore: (points: number) => void;
  nextLevel: () => void;
  
  // Object management
  addMissile: (missile: Omit<Missile, 'id'>) => void;
  removeMissile: (id: string) => void;
  addInterceptor: (interceptor: Omit<Interceptor, 'id'>) => void;
  removeInterceptor: (id: string) => void;
  addExplosion: (explosion: Omit<Explosion, 'id'>) => void;
  removeExplosion: (id: string) => void;
  destroyCity: (id: string) => void;
  
  // Game loop
  updateGame: (deltaTime: number) => void;
}

const createInitialCities = (): City[] => {
  const cityCount = 6;
  const cities: City[] = [];
  
  // Responsive spacing - cities spread across screen width
  // Using a wider spread for better screen coverage
  const screenWidth = 16; // Adjusted for better screen coverage
  const spacing = screenWidth / (cityCount + 1);
  
  for (let i = 0; i < cityCount; i++) {
    cities.push({
      id: `city-${i}`,
      x: (i + 1) * spacing - (screenWidth / 2), // Center around 0, spread from -8 to 8
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
  cities: createInitialCities(),
  missiles: [],
  interceptors: [],
  explosions: [],
  
  // Actions
  startGame: () => set({ 
    gameState: 'playing', 
    score: 0, 
    level: 1, 
    lives: 3,
    cities: createInitialCities(),
    missiles: [],
    interceptors: [],
    explosions: []
  }),
  
  endGame: () => set({ gameState: 'gameOver' }),
  
  addScore: (points: number) => set((state) => ({ 
    score: state.score + points 
  })),
  
  nextLevel: () => set((state) => ({ 
    level: state.level + 1,
    missiles: [],
    interceptors: [],
    explosions: []
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