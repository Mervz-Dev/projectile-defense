export class Bullet extends Phaser.Physics.Arcade.Sprite {
    private speed: number;
    private damage: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 400;
        this.damage = 1;

        // Auto-destroy after 1.5s
        scene.time.delayedCall(1500, () => this.destroy());
    }

    public init(): void {
        this.setVelocityX(this.speed);
        this.setBounce(0);
        this.setImmovable(true);
        this.setGravity(0, 0);
    }

    public getDamage(): number {
        return this.damage;
    }

    update(): void {
        if (this.x > this.scene.scale.width) this.destroy();
    }
}

