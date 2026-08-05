import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { StealthScene } from './scenes/StealthScene.js';
import { EndingScene } from './scenes/EndingScene.js';
import { UIScene } from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 960,
  height: 540,
  backgroundColor: '#111318',
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      debug: true, // Setting debug to true is very helpful during development!
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, StealthScene, UIScene, EndingScene],
};

new Phaser.Game(config);
