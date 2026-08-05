import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    this.objectiveText = this.add.bitmapText(10, 10, 'pixel_font', 'OBJECTIVE: REACH THE EXIT', 16);
    this.statusText = this.add.bitmapText(10, 30, 'pixel_font', 'STATUS: SAFE', 16);
    this.statusText.setTint(0x4ade80); // Green

    // Listen for events from the main game scene
    const stealthScene = this.scene.get('StealthScene');

    stealthScene.events.on('player-discovered', () => {
      this.statusText.setText('STATUS: DISCOVERED!');
      this.statusText.setTint(0xf87171); // Red

      this.tweens.add({
        targets: this.statusText,
        alpha: 0,
        duration: 200,
        ease: 'Cubic.easeInOut',
        yoyo: true,
        repeat: 3,
      });
    });

    stealthScene.events.on('player-safe', () => {
      this.statusText.setText('STATUS: SAFE');
      this.statusText.setTint(0x4ade80); // Green
    });

    stealthScene.events.on('escape-success', () => {
      this.objectiveText.setText('OBJECTIVE: ESCAPED!');
      this.objectiveText.setTint(0xfacc15); // Yellow
    });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      stealthScene.events.off('player-discovered');
      stealthScene.events.off('player-safe');
      stealthScene.events.off('escape-success');
    });
  }
}