// Enemy.ts
export interface EnemyTraits {
  name?: string;
  speed?: number;
  health?: number;
  damage?: number;
  scoreValue?: number;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected traits: Required<EnemyTraits>;
  private s;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    traits: EnemyTraits = {}
  ) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Default base traits
    this.traits = {
      name: traits.name ?? "Enemy",
      speed: traits.speed ?? -150,
      health: traits.health ?? 1,
      damage: traits.damage ?? 1,
      scoreValue: traits.scoreValue ?? 100,
    };

    const scaleX = scene.scale.width / 800; // how much wider the device is vs base
    const scaleY = scene.scale.height / 600; // how much taller the device is vs base
    this.s = Math.min(scaleX, scaleY);

    this.init();
  }

  public init(): void {
    this.setVelocityX(this.traits.speed);
    this.setBounce(0);
    this.setImmovable(true);
    this.setGravity(0, 0);
    this.setSize(this.width * 0.7, this.height * 0.7);
    this.setScale(this.s);
  }

  public takeDamage(
    amount: number = 1,
    onDestroy: (score: number) => void
  ): void {
    this.traits.health -= amount;
    if (this.traits.health <= 0) {
      onDestroy(this.traits.scoreValue);
      this.destroy();
    }
  }

  public getDamage(): number {
    return this.traits.damage;
  }

  update(): void {
    if (this.x < -50) {
      this.destroy();
    }
  }
}
