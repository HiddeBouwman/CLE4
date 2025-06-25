import { Platform, PlatformType, isBoostPlatformForPlayer, IMovablePlatform } from "./platform.ts";
import { Vector } from "excalibur";

/**
 * A platform that moves to an end position when a pressure plate is activated,
 * and returns to its starting position when the pressure plate is deactivated.
 * Implements IMovablePlatform for interaction with pressure plates.
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
 * @param boostForPlayers - Array of player numbers that receive speed boost on this platform (default: [])
 * @param spriteScale - Scale factor for the platform sprite (default: Vector(1, 1))
 */
export class PressurePlateReturnPlatform extends Platform implements IMovablePlatform {
    start: Vector;
    end: Vector;
    speed: number;
    private _pressureActive: boolean = false;
    private _activePressurePlates: number = 0;
    private _atTarget: boolean = true;

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
        boostForPlayers: number[] = [],
        spriteScale: Vector = new Vector(1, 1)
    ) {
        super(x, y, width, height, platformType, colliderWidth, colliderHeight, colliderOffset, spriteScale, boostForPlayers);
        this.start = new Vector(startPos.x * 32, startPos.y * 32);
        this.end = new Vector(endPos.x * 32, endPos.y * 32);
        this.speed = speed;
    }

    registerPressurePlateActivated() {
        this._activePressurePlates++;
        this._pressureActive = true;
    }

    registerPressurePlateDeactivated() {
        this._activePressurePlates = Math.max(0, this._activePressurePlates - 1);
        if (this._activePressurePlates === 0) {
            this._pressureActive = false;
        }
    }

    onPreUpdate(engine, delta) {
        let target = this._pressureActive ? this.end : this.start;
        let wasAtTarget = this._atTarget;
        this._atTarget = this.pos.equals(target);

        if (!this._atTarget) {
            this.moveToTarget(target, delta);
        }
        this.currentDelta = this.pos.sub(this._lastPos);
        super.onPreUpdate(engine, delta);
    }

    private moveToTarget(target: Vector, delta: number) {
        const moveVec = target.sub(this.pos);
        const distance = moveVec.magnitude;
        if (distance < 1) {
            this.pos = target.clone();
            return;
        }
        const moveStep = moveVec.normalize().scale(this.speed * (delta / 1000));
        if (moveStep.magnitude > distance) {
            this.pos = target.clone();
        } else {
            this.pos = this.pos.add(moveStep);
        }
    }

    startMoving(): void {
        // Optioneel: je kunt hier logica toevoegen als je wilt
    }

    stopMoving(): void {
        // Optioneel: je kunt hier logica toevoegen als je wilt
    }
}