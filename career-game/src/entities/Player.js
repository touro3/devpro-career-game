const SPEED = 150;

export class Player {
  constructor(scene, x, y) {
    this._scene = scene;
    this._generateTextures();
    this._createAnimations();

    this.sprite = scene.physics.add.sprite(x, y, 'player-idle');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
    this.sprite.setScale(2);
  }

  update(cursors, wasd) {
    const left = cursors.left.isDown || wasd.A.isDown;
    const right = cursors.right.isDown || wasd.D.isDown;
    const up = cursors.up.isDown || wasd.W.isDown;
    const down = cursors.down.isDown || wasd.S.isDown;

    const vx = (right ? 1 : 0) - (left ? 1 : 0);
    const vy = (down ? 1 : 0) - (up ? 1 : 0);
    const len = Math.sqrt(vx * vx + vy * vy);

    if (len > 0) {
      this.sprite.body.setVelocity((vx / len) * SPEED, (vy / len) * SPEED);
      this.sprite.anims.play('player-walk', true);
      if (vx !== 0) this.sprite.setFlipX(vx < 0);
    } else {
      this.sprite.body.setVelocity(0, 0);
      this.sprite.anims.stop();
      this.sprite.setTexture('player-idle');
    }
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  _generateTextures() {
    const scene = this._scene;
    if (scene.textures.exists('player-idle')) return;

    this._drawFrame(scene, 'player-idle', 0);
    this._drawFrame(scene, 'player-walk-0', -2);
    this._drawFrame(scene, 'player-walk-1', 2);
  }

  _drawFrame(scene, key, legOffset) {
    const g = scene.make.graphics({ add: false });

    // Hair
    g.fillStyle(0x3d1c02);
    g.fillRect(4, 0, 8, 4);

    // Head
    g.fillStyle(0xf4a261);
    g.fillRect(3, 3, 10, 8);

    // Eyes
    g.fillStyle(0x1e1e2e);
    g.fillRect(5, 6, 2, 2);
    g.fillRect(9, 6, 2, 2);

    // Shirt
    g.fillStyle(0x3b82f6);
    g.fillRect(2, 11, 12, 9);

    // Arms
    g.fillStyle(0xf4a261);
    g.fillRect(0, 11, 2, 7);
    g.fillRect(14, 11, 2, 7);

    // Pants
    g.fillStyle(0x1e3a8a);
    const ll = Math.max(0, 4 - legOffset);
    const rl = Math.max(0, 4 + legOffset);
    g.fillRect(3, 20, 4, ll);
    g.fillRect(9, 20, 4, rl);

    // Shoes
    g.fillStyle(0x1a0a00);
    g.fillRect(2, 20 + ll, 5, 2);
    g.fillRect(9, 20 + rl, 5, 2);

    g.generateTexture(key, 16, 24);
    g.destroy();
  }

  _createAnimations() {
    const scene = this._scene;
    if (scene.anims.exists('player-walk')) return;

    scene.anims.create({
      key: 'player-walk',
      frames: [
        { key: 'player-walk-0' },
        { key: 'player-idle' },
        { key: 'player-walk-1' },
        { key: 'player-idle' },
      ],
      frameRate: 8,
      repeat: -1,
    });
  }
}
