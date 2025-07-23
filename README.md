# 🚀 Missile Command - React Three Fiber

A modern remake of the classic Missile Command arcade game built with React, React Three Fiber, and TypeScript. Defend cities from incoming missiles with a retro LA skyline aesthetic and progressive difficulty scaling.

## 🎮 Game Features

- **3D Graphics**: Built with React Three Fiber for smooth 3D rendering
- **Retro Aesthetic**: 90s LA skyline vibe with carefully chosen color palette
- **Progressive Difficulty**: Increasing missile speed, count, and splitting mechanics
- **Responsive Controls**: Click/tap to launch interceptors on desktop and mobile
- **Particle Effects**: Explosive visual effects with collision detection
- **Score System**: Points for destroying missiles and protecting cities

## 🎯 How to Play

1. **Objective**: Defend your cities from incoming enemy missiles
2. **Controls**: Click or tap anywhere on the screen to launch an interceptor
3. **Strategy**: Time your interceptors to explode near incoming missiles
4. **Scoring**: Earn 100 points for each missile destroyed
5. **Survival**: Game ends when all cities are destroyed

## 🛠️ Technology Stack

- **React 19** - UI framework
- **React Three Fiber** - 3D graphics and animation
- **TypeScript** - Type safety and developer experience
- **Zustand** - Lightweight state management
- **Vite** - Fast build tool and development server
- **Three.js** - 3D graphics library

## 🎨 Color Theme

The game uses a cohesive retro color palette:

- **Charcoal** (#264653) - Background sky
- **Persian Green** (#2A9D8F) - Interceptors and UI highlights
- **Saffron** (#E9C46A) - Missile trails and glow effects
- **Sandy Brown** (#F4A261) - City buildings and terrain
- **Burnt Sienna** (#E76F51) - Explosions and warnings
- **Light Cyan** (#E0FBFC) - Glow effects and UI text

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd missile-command

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

The `vercel.json` configuration is already included for optimal deployment.

## 🎯 Game Architecture

### Components Structure

```
src/
├── components/
│   ├── GameCanvas.tsx      # Main 3D canvas setup
│   ├── Scene.tsx          # Scene management and controls
│   ├── Cities.tsx         # City buildings with LA skyline
│   ├── Missiles.tsx       # Enemy missiles with parabolic arcs
│   ├── Interceptors.tsx   # Player defense projectiles
│   ├── Explosions.tsx     # Particle effects and collision
│   ├── GameManager.tsx    # Wave spawning and difficulty
│   └── UIOverlay.tsx      # HUD and game state UI
├── store/
│   └── gameStore.ts       # Zustand state management
├── theme/
│   └── colors.ts          # Color palette constants
└── App.tsx               # Main application component
```

### Game Loop

1. **Wave Management**: GameManager spawns missiles based on level
2. **Physics**: Missiles follow parabolic arcs toward cities
3. **Collision Detection**: Explosions check for missile intersections
4. **State Updates**: Zustand manages all game state transitions
5. **Rendering**: React Three Fiber handles 3D scene updates

## 🎮 Game Mechanics

### Difficulty Scaling

- **Missile Count**: Starts at 3, increases by 1 per level (max 12)
- **Speed**: Base speed 2, increases by 0.3 per level (max +3)
- **Splitting**: 10% chance per level starting at level 4 (max 40%)

### Collision System

- Explosions expand over 2 seconds with configurable radius
- Real-time distance calculations for missile destruction
- Visual feedback with particle effects

### Scoring

- 100 points per missile destroyed
- Bonus survival points for protecting cities
- Progressive scoring based on level difficulty

## 🔧 Performance Optimizations

- Efficient object pooling for missiles and explosions
- Minimal re-renders with Zustand state management
- Optimized Three.js geometries and materials
- Proper cleanup of expired game objects

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React Three Fiber
