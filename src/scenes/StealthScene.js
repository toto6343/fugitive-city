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

    // --- Tilemap Setup ---
    const map = this.make.tilemap({ key: 'city_map' });
    const tileset = map.addTilesetImage('city_tileset', 'city_tileset');
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const wallsLayer = map.createLayer('Walls', tileset, 0, 0);

    // --- Tilemap Collision ---
    // Set collision on the 'Walls' layer. Any tile with a 'collides' property set to true in Tiled will collide.
    wallsLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(wallsLayer);

    // --- Lighting ---
    this.lights.enable();
    this.lights.setAmbientColor(0x333333);
    groundLayer.setPipeline('Light2D');
    wallsLayer.setPipeline('Light2D');

    // Neon lights for atmosphere
    this.lights.addLight(100, 100, 128, 0xff00ff, 1.5); // Pink
    this.lights.addLight(700, 450, 128, 0x00ffff, 1.5); // Cyan

    // --- Player Setup ---
    // Find the 'PlayerStart' object from the Tiled map
    const playerStart = map.findObject('Objects', (obj) => obj.name === 'PlayerStart');
    this.player = this.matter.add.sprite(playerStart.x, playerStart.y, 'player_sprite', null, {
      label: 'player',
    });
    this.player.setFixedRotation();
    this.player.setPipeline('Light2D');

    // --- DEBUGGING PLAYER OBJECT ---
    console.log("=== PLAYER DEBUG ===");
    console.log("player:", this.player);
    console.log("constructor:", this.player?.constructor?.name);
    console.log("setVelocity type:", typeof this.player?.setVelocity);
    console.log("body:", this.player?.body);
    console.log("====================");

    // Player's flashlight
    this.playerLight = this.lights.addLight(this.player.x, this.player.y, 200, 0xffffff, 1.2);

    // --- Exit Zone ---
    const exitObject = map.findObject('Objects', (obj) => obj.name === 'Exit');
    this.exitZone = this.matter.add.rectangle(exitObject.x + exitObject.width / 2, exitObject.y + exitObject.height / 2, exitObject.width, exitObject.height, {
      isStatic: true,
      isSensor: true, // Sensors trigger collision events but don't cause a physical response.
      label: 'exitZone',
    });

    // --- Robot Setup ---
    this.robots = [];
    const robotObjects = map.getObjectLayer('Robots');
    robotObjects.objects.forEach((robotObj) => {
      // Tiled patrol points are custom properties like 'patrol_1', 'patrol_2', etc.
      const patrolPoints = [];
      let i = 1;
      while (robotObj.properties && robotObj.properties.find((p) => p.name === `patrol_${i}`)) {
        const pointValue = robotObj.properties.find((p) => p.name === `patrol_${i}`).value;
        const [px, py] = pointValue.split(',').map(Number);
        patrolPoints.push({ x: px, y: py });
      }
      const robot = new Robot(this, robotObj.x, robotObj.y, patrolPoints);
      this.robots.push(robot);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    this.caught = false;

    // Matter.js collision detection is handled differently.
    // Also launch the UI Scene
    this.scene.launch('UIScene');

    this.matter.world.on('collisionstart', (event) => {
      for (const pair of event.pairs) {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Check if the collision is between the player's body and the exit zone's body
        const isPlayerExitCollision = 
          (bodyA === this.player.body && bodyB === this.exitZone) || (bodyB === this.player.body && bodyA === this.exitZone);
        if (isPlayerExitCollision) {
          this._onEscape();
        }
      }
    });
  }

  update(time, delta) {
    if (this.caught) return;

    this._handlePlayerMovement(delta);

    // Update flashlight position
    this.playerLight.setPosition(this.player.x, this.player.y);

    let discovered = false;
    let wasDiscoveredLastFrame = this.discoveredLastFrame || false;

    for (const robot of this.robots) {
      robot.update(time, delta, this.player);
      if (robot.state === RobotState.CHASE) discovered = true;

      // Using body positions for both for consistency.
      // This is a simplified "touch" collision for game over.
      const dist = Phaser.Math.Distance.Between(
        this.player.body.position.x, this.player.body.position.y,
        robot.sprite.body.position.x, robot.sprite.body.position.y
      );
      if (dist < 20) {
        this._onCaught();
      }
    }

    // Emit events to UI scene only when the state changes
    if (discovered && !wasDiscoveredLastFrame) {
      this.events.emit('player-discovered');
    } else if (!discovered && wasDiscoveredLastFrame) {
      this.events.emit('player-safe');
    }
    this.discoveredLastFrame = discovered;
  }

  _handlePlayerMovement(delta) {
    const speed = 2.5; // Adjusted speed for Matter.js
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) vx += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) vy += 1;

    const len = Math.hypot(vx, vy) || 1;
    const finalVx = (vx / len) * speed;
    const finalVy = (vy / len) * speed;

    this.player.setVelocity(finalVx, finalVy);
  }

  _onCaught() {
    if (this.caught) return;
    this.caught = true;
    this.player.setVelocity(0, 0); // This will now work correctly
    this.scene.stop('UIScene');

    const { width, height } = this.scale;
    // Semi-transparent overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    this.add
      .bitmapText(width / 2, height / 2 - 30, 'pixel_font', 'GAME OVER', 64)
      .setOrigin(0.5);
    this.add
      .bitmapText(width / 2, height / 2 + 30, 'pixel_font', '[ PRESS SPACE TO RESTART ]', 24)
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.restart());
  }

  _onEscape() {
    if (this.caught) return;
    this.caught = true; // 씬 전환 전 중복 트리거 방지
    this.events.emit('escape-success');
    this.scene.stop('UIScene');
    this.scene.start('EndingScene');
  }
}
