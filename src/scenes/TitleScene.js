import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, 'title_bg').setScale(0.5);

    this.add
      .bitmapText(width / 2, height / 2 - 80, 'pixel_font', 'THE FUGITIVE', 64)
      .setOrigin(0.5);

    this.add
      .bitmapText(width / 2, height / 2 - 20, 'pixel_font', 'A Stealth Game Prototype', 16)
      .setOrigin(0.5)
      .setTint(0xaaaaaa);

    const startText = this.add
      .bitmapText(width / 2, height / 2 + 80, 'pixel_font', '[ PRESS SPACE TO START ]', 24)
      .setOrigin(0.5);
    startText.setTint(0x4ade80);

    this.tweens.add({
      targets: startText,
      alpha: 0.4,
      duration: 700,
      ease: 'Cubic.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    const start = () => this.scene.start('StealthScene');
    this.input.keyboard.once('keydown-SPACE', start);
    this.input.once('pointerdown', start);
  }
}
