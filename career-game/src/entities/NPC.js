import Phaser from 'phaser';

const TILE_SIZE = 32;
const TRIGGER_RADIUS = 55;

export class NPC {
  constructor(scene, data) {
    this._scene = scene;
    this._data = data;

    this.x = data.mapPosition.tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = data.mapPosition.tileY * TILE_SIZE + TILE_SIZE / 2;

    this._createGlow();
    this._generateTexture();

    this._sprite = scene.add.image(this.x, this.y, `npc-${data.id}`)
      .setDepth(5).setScale(2);

    this._label = scene.add.text(this.x, this.y - 28, data.name, {
      fontSize: '6px',
      fontFamily: '"Courier New", monospace',
      color: data.nameColor,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 1).setDepth(6);

    this._indicator = scene.add.text(this.x, this.y - 40, '[E]', {
      fontSize: '5px',
      fontFamily: '"Courier New", monospace',
      color: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(6).setVisible(false);

    this._startBob();
  }

  _createGlow() {
    this._gfx = this._scene.add.graphics().setDepth(4);
    this._scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: (tween) => {
        const t = tween.getValue() / 100;
        const colorInt = parseInt(this._data.nameColor.replace('#', ''), 16);
        this._gfx.clear();
        this._gfx.fillStyle(colorInt, 0.08 + t * 0.18);
        this._gfx.fillCircle(this.x, this.y + 6, 20);
      },
    });
  }

  _generateTexture() {
    const key = `npc-${this._data.id}`;
    if (this._scene.textures.exists(key)) return;
    if (this._data.gender === 'male') this._drawMale(key);
    else this._drawFemale(key);
  }

  _drawMale(key) {
    const g = this._scene.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(8, 23, 10, 4);

    // Shoes
    g.fillStyle(0x111111);
    g.fillRect(3, 20, 4, 3);
    g.fillRect(9, 20, 4, 3);

    // Pants
    g.fillStyle(0x0d0d1f);
    g.fillRect(4, 13, 4, 8);
    g.fillRect(8, 13, 4, 8);

    // Hoodie
    g.fillStyle(0x1a1a3e);
    g.fillRect(3, 8, 10, 6);

    // Pocket
    g.fillStyle(0x12122e);
    g.fillRect(5, 11, 6, 2);

    // Arms (dark skin)
    g.fillStyle(0x4a2a0f);
    g.fillRect(1, 9, 2, 5);
    g.fillRect(13, 9, 2, 5);

    // Neck
    g.fillStyle(0x4a2a0f);
    g.fillRect(7, 7, 2, 2);

    // Head
    g.fillStyle(0x5c3317);
    g.fillRect(5, 1, 6, 7);

    // Hair
    g.fillStyle(0x0a0a0a);
    g.fillRect(5, 0, 6, 3);
    g.fillRect(4, 2, 1, 2);
    g.fillRect(11, 2, 1, 2);

    // Eyes
    g.fillStyle(0x1a0900);
    g.fillRect(6, 4, 2, 1);
    g.fillRect(9, 4, 2, 1);

    // Mouth
    g.fillStyle(0x3b1a08);
    g.fillRect(7, 6, 2, 1);

    g.generateTexture(key, 16, 24);
    g.destroy();
  }

  _drawFemale(key) {
    const g = this._scene.make.graphics({ add: false });

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillEllipse(8, 23, 9, 3);

    // Shoes (dark, sporty)
    g.fillStyle(0x1a1a1a);
    g.fillRect(5, 21, 3, 2);
    g.fillRect(9, 21, 3, 2);

    // Pants (tight athletic)
    g.fillStyle(0x0f3460);
    g.fillRect(5, 14, 3, 8);
    g.fillRect(9, 14, 3, 8);

    // Belt line
    g.fillStyle(0x1a1a4e);
    g.fillRect(5, 13, 7, 1);

    // Athletic top (fitted)
    g.fillStyle(0x22c55e);
    g.fillRect(5, 8, 7, 6);

    // Arms (light skin, slim)
    g.fillStyle(0xfde8c8);
    g.fillRect(3, 9, 2, 5);
    g.fillRect(12, 9, 2, 5);

    // Neck
    g.fillStyle(0xfde8c8);
    g.fillRect(7, 6, 3, 3);

    // Head (light skin)
    g.fillStyle(0xfde8c8);
    g.fillRect(5, 1, 7, 6);

    // Black hair (sleek)
    g.fillStyle(0x111111);
    g.fillRect(4, 0, 9, 3);
    g.fillRect(3, 2, 2, 4);
    g.fillRect(12, 2, 2, 4);

    // Green eyes
    g.fillStyle(0x22c55e);
    g.fillRect(6, 3, 2, 2);
    g.fillRect(9, 3, 2, 2);

    // Pupils
    g.fillStyle(0x000000);
    g.fillRect(7, 4, 1, 1);
    g.fillRect(10, 4, 1, 1);

    // Mouth
    g.fillStyle(0xfb7185);
    g.fillRect(7, 6, 2, 1);

    g.generateTexture(key, 16, 24);
    g.destroy();
  }

  _startBob() {
    this._scene.tweens.add({
      targets: [this._sprite, this._label, this._indicator],
      y: '-=3',
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  showIndicator(visible) {
    this._indicator.setVisible(visible);
  }

  isNear(px, py) {
    return Phaser.Math.Distance.Between(px, py, this.x, this.y) < TRIGGER_RADIUS;
  }

  get data() {
    return this._data;
  }
}
