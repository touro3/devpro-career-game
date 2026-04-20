import Phaser from 'phaser';

const TILE_SIZE = 32;
const TRIGGER_RADIUS = 60;

export class CheckpointBuilding {
  constructor(scene, checkpointData, isUnlocked, isNextUnlockable) {
    this._scene = scene;
    this.checkpointData = checkpointData;

    this.x = checkpointData.mapPosition.tileX * TILE_SIZE + TILE_SIZE;
    this.y = checkpointData.mapPosition.tileY * TILE_SIZE + TILE_SIZE;

    this._gfx = scene.add.graphics().setDepth(3);
    this._label = scene.add
      .text(this.x, this.y + 36, checkpointData.title, {
        fontSize: '9px',
        fontFamily: 'monospace',
        color: '#aaaaaa',
        align: 'center',
        wordWrap: { width: 80 },
      })
      .setOrigin(0.5, 0)
      .setDepth(4);

    this._glowGfx = scene.add.graphics().setDepth(2);
    this._pulseActive = false;

    this._draw(isUnlocked);
    this._applyFog(!isUnlocked && !isNextUnlockable);
    if (isNextUnlockable && !isUnlocked) this._startPulse();
  }

  isNear(px, py) {
    return Phaser.Math.Distance.Between(px, py, this.x, this.y) < TRIGGER_RADIUS;
  }

  setUnlocked() {
    this._removeFog();
    this._stopPulse();
    this._draw(true);
    this._label.setStyle({ color: '#ffffff' });
    this._flashUnlock();
  }

  setNextUnlockable(isNext) {
    if (isNext && !this._pulseActive) {
      this._removeFog();
      this._startPulse();
    } else if (!isNext && this._pulseActive) {
      this._stopPulse();
    }
  }

  destroy() {
    this._gfx.destroy();
    this._glowGfx.destroy();
    this._label.destroy();
    if (this._fog) this._fog.destroy();
  }

  // ── Private ────────────────────────────────────────────────

  _draw(unlocked) {
    const g = this._gfx;
    const c = unlocked ? this.checkpointData.color : 0x2a2a2a;
    const roofC = this._darken(c, 40);
    const ox = this.x - 24;
    const oy = this.y - 36;

    g.clear();

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(this.x, this.y + 18, 52, 14);

    // Roof
    g.fillStyle(roofC);
    g.fillTriangle(this.x, oy, ox, oy + 20, ox + 48, oy + 20);

    // Body
    g.fillStyle(c);
    g.fillRect(ox + 2, oy + 20, 44, 34);

    // Door
    g.fillStyle(this._darken(c, 60));
    g.fillRect(this.x - 7, oy + 36, 14, 18);

    // Windows
    g.fillStyle(unlocked ? 0xfef08a : 0x111111);
    g.fillRect(ox + 6, oy + 24, 10, 10);
    g.fillRect(ox + 32, oy + 24, 10, 10);

    // Index badge
    if (unlocked) {
      g.fillStyle(c);
      g.fillCircle(this.x + 20, oy + 4, 9);
      g.fillStyle(0xffffff);
    }
  }

  _applyFog(on) {
    if (!on || this._fog) return;
    this._fog = this._scene.add
      .rectangle(this.x, this.y - 8, 56, 62, 0x000000, 0.68)
      .setDepth(5);
  }

  _removeFog() {
    if (this._fog) {
      this._fog.destroy();
      this._fog = null;
    }
  }

  _startPulse() {
    this._pulseActive = true;
    const g = this._glowGfx;
    const { x, y } = this;

    const drawRing = (alpha) => {
      g.clear();
      g.lineStyle(3, this.checkpointData.color, alpha);
      g.strokeRect(x - 28, y - 44, 56, 62);
    };

    drawRing(0.6);
    this._pulseTween = this._scene.tweens.addCounter({
      from: 30,
      to: 90,
      duration: 900,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => drawRing(tween.getValue() / 100),
    });
  }

  _stopPulse() {
    this._pulseActive = false;
    if (this._pulseTween) { this._pulseTween.stop(); this._pulseTween = null; }
    this._glowGfx.clear();
  }

  _flashUnlock() {
    this._scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 600,
      onUpdate: (tween) => {
        const v = tween.getValue() / 100;
        this._glowGfx.clear();
        this._glowGfx.lineStyle(4 * (1 - v), this.checkpointData.color, 1 - v);
        this._glowGfx.strokeRect(this.x - 30, this.y - 46, 60, 66);
      },
      onComplete: () => this._glowGfx.clear(),
    });
  }

  _darken(hex, amount) {
    const r = Math.max(0, ((hex >> 16) & 0xff) - amount);
    const g = Math.max(0, ((hex >> 8) & 0xff) - amount);
    const b = Math.max(0, (hex & 0xff) - amount);
    return (r << 16) | (g << 8) | b;
  }
}
