import Phaser from 'phaser';

// 부팅 씬: 추후 스프라이트/사운드 에셋을 여기서 preload 예정.
// 지금은 도형 기반 프로토타입이라 로드할 에셋이 없음.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // For demonstration, we'll use placeholder assets.
    // You should replace these with your actual asset paths.
    this.load.image('player_sprite', 'assets/player.png');
    this.load.image('robot_sprite', 'assets/robot.png');
    this.load.image('title_bg', 'assets/title_bg.png');

    // Tilemap assets
    this.load.image('city_tileset', 'assets/city_tileset.png');
    this.load.tilemapTiledJSON('city_map', 'assets/city_map.json');

    // Bitmap Font
    this.load.bitmapFont('pixel_font', 'assets/font.png', 'assets/font.xml');
  }

  create() {
    // CRITICAL CHECK: Ensure the bitmap font is loaded before starting other scenes that use it.
    if (!this.cache.bitmapFont.has('pixel_font')) {
      console.error('CRITICAL ERROR: Bitmap font "pixel_font" is not in the cache. Please check the asset paths (assets/font.png, assets/font.xml) and ensure the files are valid and accessible.');
      // Optionally, you could add logic here to display an error screen, halt the game, or load a fallback font.
      return;
    }
    this.scene.start('TitleScene');
  }
}
