import { Platform, PlatformType, isBoostPlatformForPlayer } from "./platform.ts";
import { Vector } from "excalibur";

export class AlwaysMovingPlatform extends Platform {
    start: Vector;
    end: Vector;
    speed: number;
    pauseDuration: number;
    private _direction: number = 1;
    private _pauseTimer: number = 0;

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
        this.start = startPos;
        this.end = endPos;
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