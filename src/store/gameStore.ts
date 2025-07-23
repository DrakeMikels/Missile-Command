import { create } from 'zustand';
import { soundManager } from '../utils/soundManager';
import { leaderboardService } from '../utils/leaderboardService';

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

export interface HighScore {
  initials: string;
  score: number;
  level: number;
  date: string;
}

interface GameState {
  // Game state
  gameState: 'menu' | 'playing' | 'gameOver' | 'enterHighScore';
  score: number;
  level: number;
  lives: number;
  scoreMultiplier: number;
  
  // High scores
  highScores: HighScore[];
  isNewHighScore: boolean;
  
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
  
  // High score actions
  checkHighScore: () => Promise<boolean>;
  submitHighScore: (initials: string) => Promise<void>;
  getHighScores: () => HighScore[];
  loadHighScores: () => Promise<void>;
  subscribeToGlobalLeaderboard: () => void;
  
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
  highScores: [],
  isNewHighScore: false,
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
  
  endGame: async () => {
    const state = get();
    
    soundManager.playGameOver();
    
    try {
      // Check if score qualifies for global leaderboard
      const isHighScore = await state.checkHighScore();
      
      if (isHighScore) {
        set({ gameState: 'enterHighScore', isNewHighScore: true });
      } else {
        set({ gameState: 'gameOver', isNewHighScore: false });
      }
    } catch (error) {
      console.error('Error checking high score:', error);
      // Fallback to game over if there's an error
      set({ gameState: 'gameOver', isNewHighScore: false });
    }
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
  },

  // High score functions
  loadHighScores: async () => {
    try {
      const globalScores = await leaderboardService.getTopScores(10);
      const localFormat = leaderboardService.convertToLocalFormat(globalScores);
      set({ highScores: localFormat });
    } catch (error) {
      console.error('Error loading global high scores:', error);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('missileCommandHighScores');
        if (saved) {
          const highScores = JSON.parse(saved);
          set({ highScores });
        }
      } catch (localError) {
        console.error('Error loading local high scores:', localError);
      }
    }
  },

  checkHighScore: async () => {
    const state = get();
    const currentScore = state.score;
    
    try {
      return await leaderboardService.checkGlobalHighScore(currentScore);
    } catch (error) {
      console.error('Error checking global high score:', error);
             // Fallback to local check
       return state.highScores.length < 10 || currentScore > state.highScores[9]?.score;
    }
  },

  submitHighScore: async (initials: string) => {
    const state = get();
    const scoreData = {
      initials: initials.toUpperCase().slice(0, 3),
      score: state.score,
      level: state.level
    };

    try {
      // Submit to global leaderboard
      await leaderboardService.submitScore(scoreData);
      
      // Refresh local high scores from global leaderboard
      await state.loadHighScores();
      
      set({ 
        gameState: 'gameOver',
        isNewHighScore: false
      });
    } catch (error) {
      console.error('Error submitting to global leaderboard:', error);
      
      // Fallback to local storage
      const newHighScore: HighScore = {
        ...scoreData,
        date: new Date().toLocaleDateString()
      };

      const updatedHighScores = [...state.highScores, newHighScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      try {
        localStorage.setItem('missileCommandHighScores', JSON.stringify(updatedHighScores));
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
      }

      set({ 
        highScores: updatedHighScores,
        gameState: 'gameOver',
        isNewHighScore: false
      });
    }
  },

  subscribeToGlobalLeaderboard: () => {
    try {
      leaderboardService.subscribeToLeaderboard((globalScores) => {
        const localFormat = leaderboardService.convertToLocalFormat(globalScores);
        set({ highScores: localFormat });
      });
    } catch (error) {
      console.error('Error subscribing to global leaderboard:', error);
    }
  },

  getHighScores: () => {
    return get().highScores;
  }
})); 