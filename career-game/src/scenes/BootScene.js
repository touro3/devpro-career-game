import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.add.rectangle(0, 0, width, height, 0x0d1117).setOrigin(0);

    this.add.text(cx, cy - 40, 'DevPro', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#e6edf3',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 10, 'A Career Journey', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#8b949e',
      letterSpacing: 4,
    }).setOrigin(0.5);

    const hint = this.add.text(cx, cy + 60, 'Click or press any key to start', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#4b5563',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: hint,
      alpha: { from: 0.3, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.input.once('pointerdown', () => this._start());
    this.input.keyboard.once('keydown', () => this._start());
  }

  _start() {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('WorldScene');
    });
  }
}
