# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `career-game/` directory:

```bash
npm run dev          # Dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm test             # Run all tests once (Vitest)
npm run test:watch   # Tests in watch mode
npm run test:coverage
```

## Architecture

**DevPro** is a top-down pixel art career game built with Phaser 3 + Vite. All game assets are drawn at runtime via Phaser Graphics — there are no image files.

### Key Design Decisions

- **Pure JS systems** — `XPSystem`, `CheckpointSystem`, and `PersistenceSystem` have zero Phaser dependencies and are fully unit-testable. Keep it that way.
- **DOM-based UI** — `UIManager` manages all HUD/modal HTML elements separately from Phaser's canvas. Phaser only renders the game world; UI lives in the DOM.
- **Sequential unlock logic** — each checkpoint requires all previous checkpoints to be completed. This is enforced in `CheckpointSystem`.

### Data Flow

1. `src/main.js` — bootstraps Phaser with `BootScene → WorldScene`
2. `WorldScene` initializes all systems, generates the tile map, creates entities
3. `src/data/checkpoints.js` — single source of truth for all 7 career checkpoints (XP rewards, positions, skills)
4. `PersistenceSystem` wraps localStorage with injectable storage for testability

### Directory Map

```
career-game/
├── src/
│   ├── data/checkpoints.js       # Career checkpoint definitions
│   ├── systems/
│   │   ├── XPSystem.js           # XP tracking
│   │   ├── CheckpointSystem.js   # Unlock/completion logic
│   │   ├── PersistenceSystem.js  # localStorage save/load
│   │   └── UIManager.js          # DOM HUD + modals
│   ├── entities/
│   │   ├── Player.js             # WASD movement, collision
│   │   └── CheckpointBuilding.js # Static building sprites
│   └── scenes/
│       ├── BootScene.js          # Splash screen
│       └── WorldScene.js         # Main game loop
└── tests/                        # Vitest unit tests (Node env)
```

### CI/CD

GitHub Actions (`.github/workflows/deploy.yml`) runs tests then builds on push to `main`, deploying to GitHub Pages. Tests must pass before deployment.
