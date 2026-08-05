import Phaser from 'phaser';

// 엔딩: 탈출 성공 직후 뉴스 속보 화면 - 주인공이 누명을 쓰는 반전 연출.
// 나중에 CCTV 합성 이미지, 자막 타이핑 효과 등으로 확장 예정.
export class EndingScene extends Phaser.Scene {
  constructor() {
    super('EndingScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x111318).setOrigin(0);
    this.add.rectangle(0, 0, width, 60, 0x991b1b).setOrigin(0);

    this.add
      .bitmapText(20, 18, 'pixel_font', 'BREAKING NEWS', 24)
      .setOrigin(0, 0.5);

    this.add
      .bitmapText(width / 2, height / 2 - 40, 'pixel_font', 'UNIDENTIFIED FUGITIVE DESTROYS CITY FACILITIES', 24)
      .setOrigin(0.5)
      .setCenterAlign();

    this.add
      .bitmapText(width / 2, height / 2 + 40, 'pixel_font', 'An official stated: "There were no reports of malfunctioning androids."', 16)
      .setOrigin(0.5)
      .setCenterAlign()
      .setTint(0xaaaaaa)
      .setMaxWidth(width - 140);

    const restartText = this.add
      .bitmapText(width / 2, height - 40, 'pixel_font', '[ PRESS SPACE TO RETURN TO TITLE ]', 16)
      .setOrigin(0.5);
    restartText.setTint(0x4ade80);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('TitleScene'));
  }
}
