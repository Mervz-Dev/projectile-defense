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

  private speed = 400;

  private upButton: Phaser.GameObjects.Image;
  private downButton: Phaser.GameObjects.Image;
  private fireButton: Phaser.GameObjects.Image;
  private crossHair: Phaser.GameObjects.Image;

  private isDownPressed = false;
  private isUpPressed = false;
  private isFirePressed = false;

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

    this.load.image("circle_button", "ui/controls/button_circle.png");
    this.load.image("crosshair", "ui/controls/icon_crosshair.png");
    this.load.image("down_button", "ui/controls/dpad_element_north.png");
    this.load.image("up_button", "ui/controls/dpad_element_south.png");

    this.cursors = this.input.keyboard?.createCursorKeys();

    // this.responsive.preload();
  }

  create() {
    // this.add.image(512, 384, "background");

    console.log(this.responsive, "RESPONSIVE");

    this.upButton = this.add
      .image(64, this.scale.height - 155, "up_button")
      .setDepth(100)
      //   .setScale(this.responsive.scaleFactor)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.7);
    this.downButton = this.add
      .image(64, this.scale.height - 80, "down_button")
      .setDepth(100)
      //   .setScale(this.responsive.scaleFactor)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.7);

    this.fireButton = this.add
      .image(this.scale.width - 80, this.scale.height - 100, "circle_button")
      .setDepth(100)
      .setScale(1.5)
      .setInteractive({ useHandCursor: true });

    this.crossHair = this.add
      .image(this.scale.width - 80, this.scale.height - 100, "crosshair")
      .setDepth(101);
    //   .setScale(this.responsive.scaleFactor);

    this.downButton.on("pointerdown", () => {
      this.isDownPressed = true;
      this.downButton.setAlpha(0.5);
    });

    this.downButton.on("pointerup", () => {
      this.isDownPressed = false;
      this.downButton.setAlpha(0.7);
    });

    this.downButton.on("pointerout", () => {
      this.isDownPressed = false;
      this.downButton.setAlpha(0.7);
    });

    this.upButton.on("pointerdown", () => {
      this.isUpPressed = true;
      this.upButton.setAlpha(0.5);
    });

    this.upButton.on("pointerup", () => {
      this.isUpPressed = false;
      this.upButton.setAlpha(0.7);
    });

    this.upButton.on("pointerout", () => {
      this.isUpPressed = false;
      this.upButton.setAlpha(0.7);
    });

    this.fireButton.on("pointerdown", () => {
      this.isFirePressed = true;
      this.fireButton.setAlpha(0.7);
      this.crossHair.setAlpha(0.8);
      this.crossHair.setTint(0xff6666);
    });

    this.fireButton.on("pointerup", () => {
      this.isFirePressed = false;
      this.fireButton.setAlpha(1);
      this.crossHair.setAlpha(1);
      this.crossHair.clearTint();
    });

    this.fireButton.on("pointerout", () => {
      this.isFirePressed = false;
      this.fireButton.setAlpha(1);
      this.crossHair.setAlpha(1);
      this.crossHair.clearTint();
    });

    this.scoreText = this.add
      .text(12, 12, "Score: 0", { fontSize: 24 })
      .setScale(this.responsive.scaleFactor);
    this.healthText = this.add
      .text(200, 12, "Health: 20", {
        fontSize: 24,
      })
      .setScale(this.responsive.scaleFactor);

    this.add
      .text(12, this.scale.height - 36, "Space to Shoot ; Up/Down to Move", {
        fontSize: 24,
      })
      .setDepth(10)
      .setScale(this.responsive.scaleFactor);

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
      .setDepth(100)
      .setScale(this.responsive.scaleFactor);

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

    this.player = this.physics.add
      .sprite(64, 64, "ship")
      .setScale(this.responsive.scaleFactor);

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
        const y = Phaser.Math.Between(64, this.scale.height - 64);
        this.spawnEnemy(this.scale.width - 100, y);
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

    if (this.cursors?.down.isDown || this.isDownPressed) {
      this.player.setVelocityY(this.speed * this.responsive.scaleY);
    } else if (this.cursors?.up.isDown || this.isUpPressed) {
      this.player.setVelocityY(-this.speed * this.responsive.scaleY);
    } else {
      this.player.setVelocityY(0);
    }

    if (
      (this.cursors?.space.isDown || this.isFirePressed) &&
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
