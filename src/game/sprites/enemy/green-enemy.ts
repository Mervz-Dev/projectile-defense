import { Enemy } from "./enemy";

export class GreenEnemy extends Enemy {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "green_enemy", {
            name: "GreenEnemy",
            speed: -320,
            health: 1,
            damage: 2,
            scoreValue: 8,
        });
    }

    override update(): void {
        super.update();

        // Flame flicker movement
        this.y += Math.sin(this.scene.time.now / 100) * 0.5;
    }
}

