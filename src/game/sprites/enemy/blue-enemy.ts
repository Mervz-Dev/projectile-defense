import { Enemy } from "./enemy";

export class BlueEnemy extends Enemy {
    // private floatAmplitude = 20;
    private floatSpeed = 2;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "blue_enemy", {
            name: "WaterEnemy",
            speed: -120,
            health: 4,
            damage: 1,
            scoreValue: 12,
        });
    }

    override update(): void {
        super.update();

        // Smooth wave motion
        this.y += Math.sin(this.scene.time.now * 0.005 * this.floatSpeed) * 0.8;
    }
}

