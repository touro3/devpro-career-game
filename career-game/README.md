# DevPro — Career Path Game

An interactive top-down pixel game that visualizes a real computer science career journey, from foundations to AI systems engineering.

## Stack

- **Phaser 3** — game engine
- **Vite** — dev server + build
- **Vitest** — unit testing
- **GitHub Actions** — CI/CD to GitHub Pages

## Local Development

```bash
cd career-game
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Controls

| Key | Action |
|-----|--------|
| WASD | Move player |
| E | Enter / close checkpoint |
| C | Toggle career progress panel |
| R | Reset all progress |

## Running Tests

```bash
npm test            # run once
npm run test:watch  # watch mode
npm run test:coverage
```

All tests are in `/tests`. The three tested systems are:
- `XPSystem` — XP accumulation and percentage
- `CheckpointSystem` — sequential unlock logic
- `PersistenceSystem` — localStorage save/load/clear

## Project Structure

```
career-game/
├── index.html
├── style.css
├── vite.config.js
├── package.json
├── src/
│   ├── main.js                     # Phaser bootstrap
│   ├── data/
│   │   └── checkpoints.js          # career data
│   ├── systems/
│   │   ├── XPSystem.js
│   │   ├── CheckpointSystem.js
│   │   ├── PersistenceSystem.js
│   │   └── UIManager.js
│   ├── entities/
│   │   ├── Player.js
│   │   └── CheckpointBuilding.js
│   └── scenes/
│       ├── BootScene.js
│       └── WorldScene.js
└── tests/
    ├── XPSystem.test.js
    ├── CheckpointSystem.test.js
    └── PersistenceSystem.test.js
```

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push this folder as the repo root:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. In GitHub → Settings → Pages → Source: select **GitHub Actions**
4. The workflow runs on every push to `main` — tests must pass before deploy

The live URL will be: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Architecture Decisions

- **Systems are pure JS classes** — no Phaser dependency, fully unit-testable
- **UIManager manages DOM** — modal, XP bar, and progress panel are HTML/CSS, not Phaser objects
- **Textures generated at runtime** — no external image assets; pixel art drawn via Phaser Graphics
- **Sequential unlock** — each checkpoint requires the previous one to be completed
- **LocalStorage persistence** — progress survives page refreshes via injected storage interface
