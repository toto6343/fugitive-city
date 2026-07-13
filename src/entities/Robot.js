import Phaser from 'phaser';

// 로봇 적 AI - 3단계 상태머신 (PATROL / CHASE / ALERT)
// 현재는 도형(사각형) 기반 placeholder. 스프라이트 교체는 setTexture 등으로 나중에 처리.
export const RobotState = {
  PATROL: 'PATROL',
  CHASE: 'CHASE',
  ALERT: 'ALERT', // 플레이어를 놓쳤지만 마지막 위치를 살피는 중
};

export class Robot {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {{x:number,y:number}[]} patrolPoints - 순찰 경로
   */
  constructor(scene, x, y, patrolPoints) {
    this.scene = scene;
    this.patrolPoints = patrolPoints && patrolPoints.length ? patrolPoints : [{ x, y }];
    this.patrolIndex = 0;

    this.visionRange = 180; // 감지 거리(px)
    this.visionAngle = Phaser.Math.DegToRad(70); // 시야각(전체, 라디안)
    this.chaseSpeed = 90;
    this.patrolSpeed = 45;
    this.loseInterest = 1500; // 시야에서 놓친 후 ALERT 유지 시간(ms)

    this.state = RobotState.PATROL;
    this.alertTimer = 0;
    this.facingAngle = 0;
    this.lastKnownPlayerPos = null;

    this.sprite = scene.physics.add.rectangle(x, y, 28, 28, 0xef4444);
    this.sprite.setStrokeStyle(2, 0x7f1d1d);

    // 시야 표시용(디버그/연출) 삼각형 그래픽
    this.visionGfx = scene.add.graphics();
  }

  get body() {
    return this.sprite.body;
  }

  canSeePlayer(playerSprite) {
    const dx = playerSprite.x - this.sprite.x;
    const dy = playerSprite.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);
    if (dist > this.visionRange) return false;

    const angleToPlayer = Math.atan2(dy, dx);
    let diff = Phaser.Math.Angle.Wrap(angleToPlayer - this.facingAngle);
    return Math.abs(diff) <= this.visionAngle / 2;
  }

  update(time, delta, playerSprite) {
    const dt = delta / 1000;

    switch (this.state) {
      case RobotState.PATROL:
        this._patrol(dt);
        if (this.canSeePlayer(playerSprite)) {
          this.state = RobotState.CHASE;
        }
        break;

      case RobotState.CHASE:
        this._chase(dt, playerSprite);
        if (this.canSeePlayer(playerSprite)) {
          this.lastKnownPlayerPos = { x: playerSprite.x, y: playerSprite.y };
          this.alertTimer = 0;
        } else {
          this.state = RobotState.ALERT;
          this.alertTimer = 0;
        }
        break;

      case RobotState.ALERT:
        this._moveToward(this.lastKnownPlayerPos, this.chaseSpeed);
        if (this.canSeePlayer(playerSprite)) {
          this.state = RobotState.CHASE;
        } else {
          this.alertTimer += delta;
          if (this.alertTimer > this.loseInterest) {
            this.state = RobotState.PATROL;
          }
        }
        break;
    }

    this._drawVision();
  }

  _patrol(dt) {
    const target = this.patrolPoints[this.patrolIndex];
    const reached = this._moveToward(target, this.patrolSpeed);
    if (reached) {
      this.patrolIndex = (this.patrolIndex + 1) % this.patrolPoints.length;
    }
  }

  _chase(dt, playerSprite) {
    this._moveToward({ x: playerSprite.x, y: playerSprite.y }, this.chaseSpeed);
  }

  /** target 방향으로 이동, 목표 도달 시 true 반환 */
  _moveToward(target, speed) {
    if (!target) return true;
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 6) {
      this.body.setVelocity(0, 0);
      return true;
    }

    this.facingAngle = Math.atan2(dy, dx);
    this.body.setVelocity(Math.cos(this.facingAngle) * speed, Math.sin(this.facingAngle) * speed);
    return false;
  }

  _drawVision() {
    const g = this.visionGfx;
    g.clear();

    const color = this.state === RobotState.PATROL ? 0x60a5fa : 0xf87171;
    g.fillStyle(color, 0.12);

    const half = this.visionAngle / 2;
    const p1 = {
      x: this.sprite.x + Math.cos(this.facingAngle - half) * this.visionRange,
      y: this.sprite.y + Math.sin(this.facingAngle - half) * this.visionRange,
    };
    const p2 = {
      x: this.sprite.x + Math.cos(this.facingAngle + half) * this.visionRange,
      y: this.sprite.y + Math.sin(this.facingAngle + half) * this.visionRange,
    };

    g.fillTriangle(this.sprite.x, this.sprite.y, p1.x, p1.y, p2.x, p2.y);
  }

  destroy() {
    this.visionGfx.destroy();
    this.sprite.destroy();
  }
}
