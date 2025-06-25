import { Vector } from "excalibur";
import { Platform, PlatformType, IMovablePlatform } from "./platform.ts";

/**
 * Platform that moves when multiple pressure plates are activated simultaneously.
 * Default requires 2 plates, but can be configured for more.
 * Moves between two positions when the required number of plates are active.
 *
 * @param x - X coordinate in grid units (will be multiplied by 32)
 * @param y - Y coordinate in grid units (will be multiplied by 32)
 * @param width - Width of the platform actor
 * @param height - Height of the platform actor
 * @param platformType - Type of platform from PlatformType enum, determines sprite
 * @param colliderWidth - Width of the collision box
 * @param colliderHeight - Height of the collision box
 * @param colliderOffset - Offset position of the collision box
 * @param start - Starting position in grid units (will be multiplied by 32)
 * @param end - Ending position in grid units (will be multiplied by 32)
 * @param speed - Movement speed in pixels per second (default: 100)
 * @param pauseDuration - Time to pause at endpoints in milliseconds (default: 0)
 * @param boostForPlayers - Array of player numbers that receive speed boost on this platform (default: [])
 * @param spriteScale - Scale factor for the platform sprite (default: Vector(1, 1))
 * @param requiredPlates - Number of pressure plates required to activate (default: 2, minimum: 2)
 */
export class TwoPlatePlatform extends Platform implements IMovablePlatform {
    start: Vector; // starting position (x, y)
    end: Vector; // end position (x, y)
    speed: number; // movement speed
    pauseDuration: number; // How long to pause at start/end (ms)
    private _direction: number = 1;
    private _pauseTimer: number = 0; // Internal timer for pausing
    private _pressureActive: boolean = false;
    private _activePressurePlates: number = 0; // Tracks active pressure plates
    private requiredPlates: number;

    constructor(
        x: number, // starting position
        y: number, // starting position
        width: number, // platform width (unused)
        height: number, // platform height (unused)
        platformType: PlatformType, // assigns sprite
        colliderWidth: number, // platform width
        colliderHeight: number, // platform height
        colliderOffset: Vector, // platform collisionbox offset
        start: Vector, // begin position (x, y) (differs from starting position)
        end: Vector, // destination position (x, y)
        speed: number = 100, // movement speed
        pauseDuration: number = 0, // in ms
        boostForPlayers: number[] = [], // Default = none, other options are [1], [2], or [1, 2]
        spriteScale: Vector = new Vector(1, 1), // Ability to change sprite scale if needed
        requiredPlates: number = 2 // number of pressure plates it requires, can be two or more.
    ) {
        super(x, y, width, height, platformType, colliderWidth, colliderHeight, colliderOffset, spriteScale, boostForPlayers);
        this.start = new Vector(start.x * 32, start.y * 32);
        this.end = new Vector(end.x * 32, end.y * 32);
        this.speed = speed;
        this.pauseDuration = pauseDuration;
        this.requiredPlates = Math.max(2, requiredPlates); // <-- always minimum of 2
    }

    // Called by pressure plates when activated
    registerPressurePlateActivated() {
        this._activePressurePlates++;
        if (this._activePressurePlates >= this.requiredPlates) {
            this._pressureActive = true;
        }
    }

    // Called by pressure plates when deactivated
    registerPressurePlateDeactivated() {
        this._activePressurePlates = Math.max(0, this._activePressurePlates - 1);
        if (this._activePressurePlates < this.requiredPlates) {
            this._pressureActive = false;
        }
    }

    onPreUpdate(engine, delta) {
        // Sla oude positie op voor currentDelta
        const prevPos = this.pos.clone();

        // Alleen bewegen als beide pressure plates actief zijn
        if (this._pressureActive) {
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

        // currentDelta en geluiden worden geregeld door Platform
        this.currentDelta = this.pos.sub(prevPos);
        super.onPreUpdate(engine, delta);
    }

    /**
     * Moves the platform between start and end positions.
     * Returns true if the platform reached an endpoint this frame.
     */
    private moveBetweenStartAndEnd(delta: number): boolean {
        const target = this._direction === 1 ? this.end : this.start;
        const moveVec = target.sub(this.pos);
        const distance = moveVec.magnitude;

        if (distance < 1) {
            this.pos = target.clone();
            this._direction *= -1;
            return true; // Endpoint reached
        }

        const moveStep = moveVec.normalize().scale(this.speed * (delta / 1000));
        if (moveStep.magnitude > distance) {
            this.pos = target.clone();
            this._direction *= -1;
            return true; // Endpoint reached
        } else {
            this.pos = this.pos.add(moveStep);
            return false;
        }
    }

    // Voor interface compatibiliteit
    startMoving() {
        this._pressureActive = true;
    }
    stopMoving() {
        this._pressureActive = false;
    }
}
