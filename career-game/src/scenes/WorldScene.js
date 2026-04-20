import Phaser from 'phaser';
import { CHECKPOINTS, TOTAL_XP } from '../data/checkpoints.js';
import { Player } from '../entities/Player.js';
import { CheckpointBuilding } from '../entities/CheckpointBuilding.js';
import { XPSystem } from '../systems/XPSystem.js';
import { CheckpointSystem } from '../systems/CheckpointSystem.js';
import { PersistenceSystem } from '../systems/PersistenceSystem.js';
import { UIManager } from '../systems/UIManager.js';

const TILE_SIZE = 32;
const MAP_COLS = 40;
const MAP_ROWS = 28;

export class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });
  }

  create() {
    this._persistence = new PersistenceSystem();
    const saved = this._persistence.load();

    this._xp = new XPSystem(saved?.xp ?? 0);
    this._xp.setTotalPossibleXP(TOTAL_XP);

    this._checkpointSys = new CheckpointSystem(CHECKPOINTS, saved?.unlocked ?? []);

    this._ui = new UIManager();

    this._nearBuilding = null;
    this._paused = false;

    this._generateTextures();
    this._buildMap();
    this._createBuildings();
    this._createPlayer();
    this._setupCamera();
    this._setupInput();

    this._ui.updateXP(this._xp.xp, this._xp.percentage, TOTAL_XP);
    this._refreshBuildingStates();

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  update() {
    if (this._paused) return;

    this._player.update(this._cursors, this._wasd);
    this._checkProximity();
    this._handleKeys();
  }

  // ── Map construction ───────────────────────────────────────

  _generateTextures() {
    if (this.textures.exists('tile-grass')) return;

    const grassColors = [0x2d5a27, 0x2d5a27, 0x2d5a27, 0x305e2a, 0x2b5626];

    grassColors.forEach((baseColor, i) => {
      const g = this.make.graphics({ add: false });
      g.fillStyle(baseColor);
      g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x265221, 0.5);
      g.fillRect(6, 5, 3, 3);
      g.fillRect(18, 14, 2, 2);
      g.fillRect(26, 8, 3, 3);
      g.generateTexture(`tile-grass-${i}`, TILE_SIZE, TILE_SIZE);
      g.destroy();
    });

    const pg = this.make.graphics({ add: false });
    pg.fillStyle(0x7c5c2e);
    pg.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    pg.fillStyle(0x8a6636, 0.6);
    pg.fillRect(4, 4, 5, 5);
    pg.fillRect(16, 20, 4, 4);
    pg.fillRect(24, 10, 5, 3);
    pg.generateTexture('tile-path', TILE_SIZE, TILE_SIZE);
    pg.destroy();

    const tg = this.make.graphics({ add: false });
    tg.fillStyle(0x1a3d16);
    tg.fillRect(10, 16, 12, 16);
    tg.fillStyle(0x2d6b26);
    tg.fillTriangle(16, 0, 4, 20, 28, 20);
    tg.fillStyle(0x3a8230);
    tg.fillTriangle(16, 4, 6, 22, 26, 22);
    tg.generateTexture('tile-tree', 32, 32);
    tg.destroy();
  }

  _buildMap() {
    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;

    this.physics.world.setBounds(0, 0, worldW, worldH);

    const bg = this.add.renderTexture(0, 0, worldW, worldH).setOrigin(0, 0).setDepth(0);

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const variant = (row * 7 + col * 3) % 5;
        bg.draw(`tile-grass-${variant}`, col * TILE_SIZE, row * TILE_SIZE);
      }
    }

    const pathTiles = this._computePathTiles();
    pathTiles.forEach(({ x, y }) => {
      bg.draw('tile-path', x * TILE_SIZE, y * TILE_SIZE);
    });

    this._addDecorations(bg);
  }

  _computePathTiles() {
    const seen = new Set();
    const tiles = [];

    const add = (x, y) => {
      const key = `${x},${y}`;
      if (seen.has(key) || x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) return;
      seen.add(key);
      tiles.push({ x, y });
    };

    for (let i = 0; i < CHECKPOINTS.length - 1; i++) {
      const from = CHECKPOINTS[i].mapPosition;
      const to = CHECKPOINTS[i + 1].mapPosition;

      // L-shaped path: horizontal segment then vertical
      const dx = to.tileX > from.tileX ? 1 : -1;
      const dy = to.tileY > from.tileY ? 1 : -1;

      let x = from.tileX;
      while (x !== to.tileX) {
        add(x, from.tileY);
        add(x, from.tileY + 1);
        x += dx;
      }
      let y = from.tileY;
      while (y !== to.tileY) {
        add(to.tileX, y);
        add(to.tileX + 1, y);
        y += dy;
      }
      add(to.tileX, to.tileY);
    }

    return tiles;
  }

  _addDecorations(rt) {
    const occupied = new Set(
      CHECKPOINTS.map(cp => `${cp.mapPosition.tileX},${cp.mapPosition.tileY}`)
    );

    const treePositions = [
      [2, 2], [8, 2], [38, 2], [1, 14], [38, 14],
      [2, 26], [38, 26], [16, 10], [33, 22], [7, 17],
    ];

    treePositions.forEach(([col, row]) => {
      if (!occupied.has(`${col},${row}`)) {
        rt.draw('tile-tree', col * TILE_SIZE, row * TILE_SIZE);
      }
    });
  }

  // ── Entities ───────────────────────────────────────────────

  _createBuildings() {
    this._buildings = CHECKPOINTS.map(cp => {
      const unlocked = this._checkpointSys.isUnlocked(cp.id);
      const nextUnlockable = this._checkpointSys.canUnlock(cp.id);
      return new CheckpointBuilding(this, cp, unlocked, nextUnlockable);
    });
  }

  _createPlayer() {
    const start = CHECKPOINTS[0].mapPosition;
    const px = start.tileX * TILE_SIZE + TILE_SIZE * 3;
    const py = start.tileY * TILE_SIZE;
    this._player = new Player(this, px, py);
  }

  // ── Camera & input ─────────────────────────────────────────

  _setupCamera() {
    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this._player.sprite, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
  }

  _setupInput() {
    this._cursors = this.input.keyboard.createCursorKeys();
    this._wasd = this.input.keyboard.addKeys({ W: 'W', A: 'A', S: 'S', D: 'D' });
    this._eKey = this.input.keyboard.addKey('E');
    this._cKey = this.input.keyboard.addKey('C');
    this._rKey = this.input.keyboard.addKey('R');
  }

  // ── Game logic ─────────────────────────────────────────────

  _checkProximity() {
    this._nearBuilding = null;

    for (const building of this._buildings) {
      if (building.isNear(this._player.x, this._player.y)) {
        this._nearBuilding = building;
        break;
      }
    }

    this._ui.showInteractPrompt(this._nearBuilding !== null);
  }

  _handleKeys() {
    if (Phaser.Input.Keyboard.JustDown(this._eKey)) {
      if (this._ui.isModalOpen()) {
        this._ui.hideModal();
        this._paused = false;
        return;
      }
      if (this._nearBuilding) this._enterBuilding(this._nearBuilding);
    }

    if (Phaser.Input.Keyboard.JustDown(this._cKey)) {
      if (this._ui.isProgressOpen()) {
        this._ui.hideProgress();
        this._paused = false;
      } else {
        this._ui.showProgress(CHECKPOINTS, this._checkpointSys.getUnlockedIds());
        this._paused = true;
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this._rKey)) {
      this._resetGame();
    }
  }

  _enterBuilding(building) {
    const cp = building.checkpointData;
    const alreadyUnlocked = this._checkpointSys.isUnlocked(cp.id);

    if (alreadyUnlocked) {
      this._paused = true;
      this._ui.showModal(cp, false, () => { this._paused = false; });
      return;
    }

    if (this._checkpointSys.canUnlock(cp.id)) {
      this._checkpointSys.unlock(cp.id);
      this._xp.addXP(cp.xpReward);
      building.setUnlocked();

      this._persistence.save({
        xp: this._xp.xp,
        unlocked: this._checkpointSys.getUnlockedIds(),
      });

      this._ui.updateXP(this._xp.xp, this._xp.percentage, TOTAL_XP);
      this._refreshBuildingStates();

      this._paused = true;
      this._ui.showModal(cp, true, () => { this._paused = false; });
      return;
    }

    this._ui.showLockedToast();
  }

  _refreshBuildingStates() {
    const next = this._checkpointSys.getNextUnlockable();
    this._buildings?.forEach(b => {
      const isNext = next && b.checkpointData.id === next.id;
      b.setNextUnlockable(isNext);
    });
  }

  _resetGame() {
    this._persistence.clear();
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.restart();
    });
  }
}
