import Phaser from 'phaser';
import { Robot, RobotState } from '../entities/Robot.js';

// 은신 파트 프로토타입: 무기 없이 로봇 시야를 피해 탈출구까지 이동.
// 발견당하면 실패, 탈출구 도달하면 EndingScene으로 전환.
export class StealthScene extends Phaser.Scene {
  constructor() {
    super('StealthScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, 20, '은신 구간 (프로토타입) - 방향키/WASD로 이동, 빨간 시야에 들어가면 발각',{
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#aaa',
      })
      .setOrigin(0.5, 0);

    // 플레이어 (placeholder: 초록 사각형)
    // Use this.matter.add.rectangle for Matter.js
    this.player = this.matter.add.rectangle(80, height - 80, 24, 24, {
      render: { fillColor: 0x4ade80 },
    });
    // Matter.js bodies collide with world bounds by default.

    // 탈출구 (placeholder: 노란 사각형, 우상단)
    // For Matter.js, create a sensor for the exit zone.
    this.exitZone = this.matter.add.rectangle(width - 60, 60, 50, 50, {
      isStatic: true,
      isSensor: true, // Sensors trigger collision events but don't cause a physical response.
      render: {
        fillColor: 0xfacc15,
      },
    });
    this.add
      .text(width - 60, 60, 'EXIT', { fontFamily: 'sans-serif', fontSize: '12px', color: '#fde68a' })
      .setOrigin(0.5);

    // 로봇 배치 (순찰 경로 예시 2대)
    this.robots = [
      new Robot(this, 400, 150, [
        { x: 400, y: 150 },
        { x: 650, y: 150 },
        { x: 650, y: 350 },
        { x: 400, y: 350 },
      ]),
      new Robot(this, 250, 400, [
        { x: 250, y: 400 },
        { x: 550, y: 400 },
      ]),
    ];

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    this.caught = false;

    // Matter.js collision detection is handled differently.
    this.matter.world.on('collisionstart', (event) => {
      for (const pair of event.pairs) {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        if ((bodyA === this.player && bodyB === this.exitZone) || (bodyA === this.exitZone && bodyB === this.player)) {
          this._onEscape();
        }
      }
    });
  }

  update(time, delta) {
    if (this.caught) return;

    this._handlePlayerMovement();

    let discovered = false;
    for (const robot of this.robots) {
      robot.update(time, delta, this.player);
      if (robot.state === RobotState.CHASE) discovered = true;

      // 단순 충돌 = 발각(붙잡힘) 처리 - Distance check is fine and works with any physics engine.
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, robot.sprite.x, robot.sprite.y);
      if (dist < 20) {
        this._onCaught();
      }
    }

    this._updateStatusText(discovered);
  }

  _handlePlayerMovement() {
    const speed = 160;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) vx += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) vy += 1;

    const len = Math.hypot(vx, vy) || 1;
    // Use this.player.setVelocity for Matter.js bodies
    this.player.setVelocity(((vx / len) * speed) / 16.66, ((vy / len) * speed) / 16.66);
  }

  _updateStatusText(discovered) {
    if (!this.statusText) {
      this.statusText = this.add.text(10, 10, '', { fontFamily: 'sans-serif', fontSize: '14px' });
    }
    this.statusText.setText(discovered ? '⚠ 발각됨!' : '안전');
    this.statusText.setColor(discovered ? '#f87171' : '#4ade80');
  }

  _onCaught() {
    if (this.caught) return;
    this.caught = true;
    this.player.setVelocity(0, 0);

    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, 'GAME OVER\n스페이스로 재시작', {
        fontFamily: 'sans-serif',
        fontSize: '28px',
        color: '#f87171',
        align: 'center',
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.restart());
  }

  _onEscape() {
    if (this.caught) return;
    this.caught = true; // 씬 전환 전 중복 트리거 방지
    this.scene.start('EndingScene');
  }
}
