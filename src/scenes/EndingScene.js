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
      .text(20, 18, '속보', { fontFamily: 'sans-serif', fontSize: '24px', color: '#fff' })
      .setOrigin(0, 0);

    this.add
      .text(width / 2, height / 2 - 40, '정체불명 괴한, 도심 시설 파괴 후 도주', {
        fontFamily: 'sans-serif',
        fontSize: '22px',
        color: '#f5f5f5',
        align: 'center',
        wordWrap: { width: width - 100 },
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, '정부 측은 사건과 관련해 "로봇 관련 보고는 없었다"고 밝혔다.', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#999',
        align: 'center',
        wordWrap: { width: width - 140 },
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height - 40, '[ SPACE로 타이틀로 ]', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#4ade80',
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('TitleScene'));
  }
}
