import { Platform, PlatformType, isBoostPlatformForPlayer, IMovablePlatform } from "./platform.ts";
import { Vector } from "excalibur";

/**
 * A platform that moves between two positions when activated by a pressure plate.
 * Implements IMovablePlatform interface for interaction with pressure plates.
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
export class PressurePlatePlatform extends Platform implements IMovablePlatform {
    start: Vector;
    end: Vector;
    speed: number;
    pauseDuration: number;
    private _direction: number = 1;
    private _pauseTimer: number = 0;
    private _moving: boolean = false;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        platformType: PlatformType,
        colliderWidth: number,
        colliderHeight: number,
        colliderOffset: Vector,
        startPos: Vector,
        endPos: Vector,
        speed: number = 100,
        pauseDuration: number = 0,
        boostForPlayers: number[] = [],
        spriteScale: Vector = new Vector(1, 1)
    ) {
        super(x, y, width, height, platformType, colliderWidth, colliderHeight, colliderOffset, spriteScale, boostForPlayers);
        this.start = new Vector(startPos.x * 32, startPos.y * 32);
        this.end = new Vector(endPos.x * 32, endPos.y * 32);
        this.speed = speed;
        this.pauseDuration = pauseDuration;
    }

    startMoving() {
        this._moving = true;
    }

    stopMoving() {
        this._moving = false;
    }

    onPreUpdate(engine, delta) {
        if (this._moving) {
            if (this._pauseTimer > 0) {
                this._pauseTimer -= delta;
                if (this._pauseTimer < 0) this._pauseTimer = 0;
            } else {
                const reached = this.moveBetweenStartAndEnd(delta);
                if (reached && this.pauseDuration > 0) {
                    this._pauseTimer = this.pauseDuration;
                }
            }
        }
        this.currentDelta = this.pos.sub(this._lastPos);
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