import { Scene } from "phaser";
import { Bullet } from "../sprites/bullet";
import { Enemy } from "../sprites/enemy/enemy";
import { PinkEnemy } from "../sprites/enemy/pink-enemy";
import { BlueEnemy } from "../sprites/enemy/blue-enemy";
import { GreenEnemy } from "../sprites/enemy/green-enemy";

export class Game extends Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  private player: Phaser.Physics.Arcade.Image;

  private bullets: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;

  private scoreText: Phaser.GameObjects.Text;
  private healthText: Phaser.GameObjects.Text;

  private lastShotTime = 0;
  private shootCooldown = 350; // ms

  private score = 0;
  private health = 10;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("ship", "ships/ship_1.png");
    this.load.image("missile", "missiles/missile_1.png");

    this.load.image("pink_enemy", "enemies/pink_alien.png");
    this.load.image("green_enemy", "enemies/green_alien.png");
    this.load.image("blue_enemy", "enemies/blue_alien.png");

    this.load.image("logo", "logo.png");

    this.load.audio("gun", "audio/gun_1.wav");

    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  create() {
    // this.add.image(512, 384, "background");

    this.scoreText = this.add.text(12, 12, "Score: 0", { fontSize: 24 });
    this.healthText = this.add.text(200, 12, "Health: 20", {
      fontSize: 24,
    });

    this.add
      .text(12, this.scale.height - 36, "Space to Shoot ; Up/Down to Move", {
        fontSize: 24,
      })
      .setDepth(100);

    this.add
      .text(
        this.scale.width - 12,
        this.scale.height - 36,
        this.registry.get("name"),
        {
          fontSize: 24,
        }
      )
      .setOrigin(1, 0)
      .setDepth(100);

    const leftSensor = this.add.rectangle(
      0,
      this.scale.height / 2,
      10,
      this.scale.height
    );

    // const body = leftSensor.body as Phaser.Physics.Arcade.Body;
    // body.setAllowGravity(false);
    // body.setImmovable(true);

    // Make invisible
    leftSensor.setVisible(false);

    this.physics.add.existing(leftSensor);

    this.scoreText.setDepth(100);
    this.healthText.setDepth(100);

    this.player = this.physics.add.sprite(64, 64, "ship");

    this.bullets = this.physics.add.group({
      classType: Bullet,
    });

    this.enemies = this.physics.add.group({
      classType: Enemy,
    });

    this.physics.add.collider(this.bullets, this.enemies);

    this.player.setCollideWorldBounds(true, 0, 0);
    this.player.setBounce(0, 0);

    const spawnRef = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        const y = Phaser.Math.Between(64, 640);
        this.spawnEnemy(800, y);
      },
    });

    this.physics.add.overlap(this.bullets, this.enemies, (b, e) => {
      const _enemy = e as Enemy;
      const _bullet = b as Bullet;

      _enemy.takeDamage(_bullet.getDamage(), (s) => {
        this.score += s;
      });

      _bullet.destroy();
    });

    this.physics.add.overlap(leftSensor, this.enemies, (senson, e) => {
      const _enemy = e as Enemy;
      // console.log(_enemy.getDamage(), "damage");
      this.health -= _enemy.getDamage();

      if (this.health <= 0) {
        spawnRef.destroy();
        this.showGameOver();
      }

      _enemy.destroy();
    });
  }

  update(time: number) {
    this.scoreText.setText(`Score: ${this.score}`);
    this.healthText.setText(`Health: ${this.health}`);

    if (this.health <= 0) {
      return;
    }

    if (this.cursors?.down.isDown) {
      this.player.setVelocityY(400);
    } else if (this.cursors?.up.isDown) {
      this.player.setVelocityY(-400);
    } else {
      this.player.setVelocityY(0);
    }

    if (
      this.cursors?.space.isDown &&
      time > this.lastShotTime + this.shootCooldown
    ) {
      this.sound.play("gun");
      const bullet = new Bullet(
        this,
        this.player.x + 10,
        this.player.y,
        "missile"
      );

      this.bullets.add(bullet);
      bullet.init();

      this.lastShotTime = time;
    }
  }

  spawnEnemy(x: number, y: number) {
    const type = Phaser.Math.RND.pick(["pink", "blue", "green"]);
    let e;
    if (type === "pink") {
      e = new PinkEnemy(this, x, y);
    } else if (type === "blue") {
      e = new BlueEnemy(this, x, y);
    } else {
      e = new GreenEnemy(this, x, y);
    }

    if (e) {
      this.enemies.add(e);
      e.init();
    }
  }

  showGameOver() {
    // Pause gameplay
    this.physics.world.pause();

    // Dim the screen
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.5
    );

    // Game Over text
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 40, "GAME OVER", {
        fontSize: "48px",
        color: "#ff4444",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Score
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
        `Score: ${this.score}`,
        {
          fontSize: "24px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    // Create a restart button
    const restartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 80, "Restart", {
        fontSize: "24px",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Button hover effect
    restartButton.on("pointerover", () => {
      restartButton.setStyle({ fill: "#ffff00" });
    });
    restartButton.on("pointerout", () => {
      restartButton.setStyle({ fill: "#00ff00" });
    });

    // Restart scene when clicked
    restartButton.on("pointerdown", () => {
      this.health = 10;
      this.score = 0;
      this.scene.restart();
    });
  }
}
