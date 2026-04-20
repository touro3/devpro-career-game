const SPEED = 150;

export class Player {
  constructor(scene, x, y) {
    this._scene = scene;
    this._generateTextures();
    this._createAnimations();

    this.sprite = scene.physics.add.sprite(x, y, 'player-idle-v2');
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
      this.sprite.anims.play('player-walk-v2', true);
      if (vx !== 0) this.sprite.setFlipX(vx < 0);
    } else {
      this.sprite.body.setVelocity(0, 0);
      this.sprite.anims.stop();
      this.sprite.setTexture('player-idle-v2');
    }
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  _generateTextures() {
    const scene = this._scene;
    if (scene.textures.exists('player-idle-v2')) return;

    this._drawFrame(scene, 'player-idle-v2', 0);
    this._drawFrame(scene, 'player-walk-0-v2', -2);
    this._drawFrame(scene, 'player-walk-1-v2', 2);
  }

  _drawFrame(scene, key, legOffset) {
    const g = scene.make.graphics({ add: false });

    // Hair (black, slim)
    g.fillStyle(0x111111);
    g.fillRect(5, 0, 6, 4);
    g.fillRect(4, 1, 1, 3);
    g.fillRect(11, 1, 1, 3);

    // Head (brown skin, 8px wide)
    g.fillStyle(0xc47e3a);
    g.fillRect(4, 3, 8, 8);

    // Eyes
    g.fillStyle(0x1e1e2e);
    g.fillRect(5, 7, 2, 2);
    g.fillRect(9, 7, 2, 2);

    // Shirt (slim, 6px wide)
    g.fillStyle(0x3b82f6);
    g.fillRect(5, 11, 6, 9);

    // Arms (brown skin)
    g.fillStyle(0xc47e3a);
    g.fillRect(3, 12, 2, 6);
    g.fillRect(11, 12, 2, 6);

    // Pants
    g.fillStyle(0x1e3a8a);
    const ll = Math.max(0, 4 - legOffset);
    const rl = Math.max(0, 4 + legOffset);
    g.fillRect(5, 20, 3, ll);
    g.fillRect(8, 20, 3, rl);

    // Shoes
    g.fillStyle(0x1a0a00);
    g.fillRect(4, 20 + ll, 4, 2);
    g.fillRect(8, 20 + rl, 4, 2);

    g.generateTexture(key, 16, 24);
    g.destroy();
  }

  _createAnimations() {
    const scene = this._scene;
    if (scene.anims.exists('player-walk-v2')) return;

    scene.anims.create({
      key: 'player-walk-v2',
      frames: [
        { key: 'player-walk-0-v2' },
        { key: 'player-idle-v2' },
        { key: 'player-walk-1-v2' },
        { key: 'player-idle-v2' },
      ],
      frameRate: 8,
      repeat: -1,
    });
  }
}
