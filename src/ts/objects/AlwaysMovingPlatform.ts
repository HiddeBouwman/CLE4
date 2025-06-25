import { Platform, PlatformType, isBoostPlatformForPlayer } from "./platform.ts";
import { Vector } from "excalibur";

/**
 * A platform that continuously moves back and forth between two positions,
 * regardless of player interaction or pressure plates.
 *
 * @param x - X coordinate in grid units (will be multiplied by 32)
 * @param y - Y coordinate in grid units (will be multiplied by 32)
 * @param width - Width of the platform actor
 * @param height - Height of the platform actor
 * @param platformType - Type of platform from PlatformType enum, determines sprite
 * @param colliderWidth - Width of the collision box
 * @param colliderHeight - Height of the collision box
 * @param colliderOffset - Offset position of the collision box
 * @param startPos - Starting position in grid units (will be multiplied by 32)
 * @param endPos - Ending position in grid units (will be multiplied by 32)
 * @param speed - Movement speed in pixels per second (default: 100)
 * @param pauseDuration - Time to pause at endpoints in milliseconds (default: 0)
 * @param boostForPlayers - Array of player numbers that receive speed boost on this platform (default: [])
 * @param spriteScale - Scale factor for the platform sprite (default: Vector(1, 1))
 */
export class AlwaysMovingPlatform extends Platform {
    start: Vector;
    end: Vector;
    speed: number;
    pauseDuration: number;
    private _direction: number = 1;
    private _pauseTimer: number = 0;

    constructor(
        x: number, // Starting position X
        y: number, // Starting position Y
        width: number, // Currently has no real use
        height: number, // Currently has no real use
        platformType: PlatformType, // Decides the sprite of the platform
        colliderWidth: number, // Width of the platform, calculated from the left side
        colliderHeight: number, // Height of the platform, calculated from the top side
        colliderOffset: Vector, // Offset of the platform
        startPos: Vector, // Beginning point of the moving platform, goes to endPos from this position.
        endPos: Vector, // End point of the moving platform, goes back to startPos after reaching this position.
        speed: number = 100, // Movement speed of the platform
        pauseDuration: number = 0, // Allows for cooldown when it reaches starting point or endpoint, in milliseconds.
        boostForPlayers: number[] = [], // Allows for boost for players. is either [], [1], [2], or [1, 2]
        spriteScale: Vector = new Vector(1, 1) // Changes the scale of the sprite
    ) {
        super(x, y, width, height, platformType, colliderWidth, colliderHeight, colliderOffset, spriteScale, boostForPlayers);
        this.start = new Vector(startPos.x * 32, startPos.y * 32);
        this.end = new Vector(endPos.x * 32, endPos.y * 32);
        this.speed = speed;
        this.pauseDuration = pauseDuration;
    }

    onPreUpdate(engine, delta) {
        if (this._pauseTimer > 0) {
            this._pauseTimer -= delta;
            if (this._pauseTimer < 0) this._pauseTimer = 0;
        } else {
            const reached = this.moveBetweenStartAndEnd(delta);
            if (reached && this.pauseDuration > 0) {
                this._pauseTimer = this.pauseDuration;
            }
        }
        // Eerst currentDelta bijwerken
        this.currentDelta = this.pos.sub(this._lastPos);
        // Daarna pas super.onPreUpdate
        super.onPreUpdate(engine, delta);
    }

    private moveBetweenStartAndEnd(delta: number): boolean {
        const target = this._direction === 1 ? this.end : this.start;
        const moveVec = target.sub(this.pos);
        const distance = moveVec.magnitude;

        if (distance < 1) {
            this.pos = target.clone();
            this._direction *= -1;
            return true;
        }

        const moveStep = moveVec.normalize().scale(this.speed * (delta / 1000));
        if (moveStep.magnitude > distance) {
            this.pos = target.clone();
            this._direction *= -1;
            return true;
        } else {
            this.pos = this.pos.add(moveStep);
            return false;
        }
    }
}