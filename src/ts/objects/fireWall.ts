import { Actor, Vector, Engine } from "excalibur";
import { Fire } from "./fire";

type FireDirection = "up" | "down" | "left" | "right";

/**
 * Creates a line of fire hazards between two coordinates.
 * Can be horizontal, vertical, or diagonal.
 *
 * @param startX - Starting X coordinate in grid units
 * @param startY - Starting Y coordinate in grid units
 * @param endX - Ending X coordinate in grid units
 * @param endY - Ending Y coordinate in grid units
 * @param direction - Direction of fire animation ("up", "down", "left", "right", default: "up")
 */
export class FireWall extends Actor {
    start: Vector;
    end: Vector;
    direction: FireDirection;

    constructor(startX: number, startY: number, endX: number, endY: number, direction: FireDirection = "up") {
        super();
        this.start = new Vector(startX, startY);
        this.end = new Vector(endX, endY);
        this.direction = direction;
    }

    onInitialize(engine: Engine) {
        // Plaats vuur-actors tussen start en end, elke 0.5 tile (8px)
        const dx = this.end.x - this.start.x;
        const dy = this.end.y - this.start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(length * 2); // elke halve tile

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = this.start.x + dx * t;
            const y = this.start.y + dy * t;
            if (this.scene) {
                this.scene.add(new Fire(x, y, this.direction));
            }
        }
    }
}