import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 80, '도망자', {
        fontFamily: 'sans-serif',
        fontSize: '48px',
        color: '#e5e5e5',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 30, 'The Fugitive City', {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: '#888',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(width / 2, height / 2 + 60, '[ SPACE 또는 클릭으로 시작 ]', {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: '#4ade80',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const start = () => this.scene.start('StealthScene');
    this.input.keyboard.once('keydown-SPACE', start);
    this.input.once('pointerdown', start);
  }
}
