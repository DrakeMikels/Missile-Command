# 🎮 Game Dev Prompt: Missile Command (React Three Fiber)

## Overview
You're building a modern remake of Missile Command using React and React Three Fiber. The player defends cities from falling enemy missiles by clicking/tapping to launch interceptors.

## Objectives
- Render a 3D scene with enemy missiles and defensive explosions.
- Detect collisions between explosions and enemy projectiles.
- Track scores, health of cities, and difficulty escalation.
- Deploy to Vercel with mobile responsiveness.

## Color Theme
Use the following colors consistently for a cohesive, stylized look:

| Purpose         | Color Name     | Hex Code |
|-----------------|----------------|----------|
| Background Sky  | Charcoal       | `#264653` |
| Interceptors / UI | Persian Green  | `#2A9D8F` |
| Missile Trails  | Saffron        | `#E9C46A` |
| City Objects    | Sandy Brown    | `#F4A261` |
| Explosions      | Burnt Sienna   | `#E76F51` |
| Highlights      | Light Cyan     | `#E0FBFC` |

## Ruleset
- Use **React Three Fiber** for all 3D scene rendering.
- Create a central color config: `theme/colors.js`.
- Use **Zustand** or Context API for game state management.
- Enemy missiles:
  - Fall from the top, curve toward cities.
  - Can split into multiple heads at higher levels.
- Interceptors:
  - Launch from click/tap, explode with radius-based detection.
- Cities:
  - Destructible. Game ends when all are destroyed.
- UI Overlay:
  - Score, level, retry/start buttons.
- Explosion Effects:
  - Particles + color change using Burnt Sienna.
- Deploy to Vercel via GitHub CI/CD.

## Components
- `<GameCanvas />`: Scene setup, camera, lighting.
- `<Missile />`: Enemy projectiles.
- `<Interceptor />`: Player defense.
- `<Explosion />`: Area collision + visual.
- `<City />`: Static mesh, damage handler.
- `<UIOverlay />`: HUD elements and game state messages.

## Milestones
1. Setup project structure, deploy to Vercel.
2. Implement scene rendering, camera controls.
3. Add missiles, interceptors, explosion detection.
4. Add scoring system and game loop.
5. Style game using the color theme.
6. Polish and deploy final version.
