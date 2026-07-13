import Phaser from 'phaser';

// 부팅 씬: 추후 스프라이트/사운드 에셋을 여기서 preload 예정.
// 지금은 도형 기반 프로토타입이라 로드할 에셋이 없음.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // TODO: 실제 에셋(로봇 스프라이트, 플레이어 스프라이트, 사운드) 추가 시 여기에 preload
  }

  create() {
    this.scene.start('TitleScene');
  }
}
