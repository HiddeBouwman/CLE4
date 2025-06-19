import { Vector } from "excalibur";
import { Platform, PlatformType, MovementMode } from "./platform.ts";

export class MovingPlatform extends Platform {
    start: Vector; // starting position (x, y)
    end: Vector; // end position (x, y)
    speed: number; // movement speed
    moving: boolean = false;
    private _direction: number = 1;
    movementMode: MovementMode; // Always, PressurePlate or PressurePlateReturn
    private _pressureActive: boolean = false;
    private _lastPos: Vector = Vector.Zero;
    public currentDelta: Vector = Vector.Zero;
    pauseDuration: number; // How long to pause at start/end (ms)
    private _pauseTimer: number = 0; // Internal timer for pausing
    private _activePressurePlates: number = 0; // Tracks active pressure plates

    constructor(
        x: number, // starting position
        y: number, // starting position
        width: number, // platform width (unused)
        height: number, // platform height (unused)
        platformType: PlatformType, // assigns sprite
        colliderWidth: number, // platform width
        colliderHeight: number, // platform height
        colliderOffset: Vector, // platform collisionbox offset
        start?: Vector, // begin position (x, y) (differs from starting position)
        end?: Vector, // destination position (x, y)
        speed: number = 100, // movement speed
        movementMode: MovementMode = MovementMode.Always, // Default = Always, other options are PressurePlate or PressurePlateReturn
        pauseDuration: number = 0, // in ms
        boostForPlayers: number[] = [], // Default = none, other options are [1], [2], or [1, 2]
        spriteScale: Vector = new Vector(1, 1) // Ability to change sprite scale if needed
    ) {
        super(x, y, width, height, platformType, colliderWidth, colliderHeight, colliderOffset, spriteScale, boostForPlayers);

        this.start = start ?? new Vector(x, y);
        this.end = end ?? new Vector(x, y);
        this.speed = speed;
        this.movementMode = movementMode;
        this.pauseDuration = pauseDuration;

        // if Always mode: start moving directly
        if (this.movementMode === MovementMode.Always) {
            this.moving = true;
        }
    }

    // Called by pressure plates when activated
    registerPressurePlateActivated() {
        this._activePressurePlates++;
        this._pressureActive = true;
        if (this.movementMode === MovementMode.PressurePlate) {
            this.moving = true;
        }
    }

    // Called by pressure plates when deactivated
    registerPressurePlateDeactivated() {
        this._activePressurePlates = Math.max(0, this._activePressurePlates - 1);
        if (this._activePressurePlates === 0) {
            this._pressureActive = false;
            if (this.movementMode === MovementMode.PressurePlate) {
                this.moving = false;
            }
        }
    }

    // pressure plate calls upon these
    startMoving() {
        this._pressureActive = true;
        if (this.movementMode === MovementMode.PressurePlate) {
            this.moving = true;
        }
    }

    stopMoving() {
        this._pressureActive = false;
        if (this.movementMode === MovementMode.PressurePlate) {
            this.moving = false;
        }
    }

    onPreUpdate(_engine, delta) {
        // Save current position before moving
        this._lastPos = this.pos.clone();

        if (this.start.equals(this.end)) return;

        // Only apply pause logic for Always and PressurePlate modes
        if (
            (this.movementMode === MovementMode.Always && this.moving) ||
            (this.movementMode === MovementMode.PressurePlate && this.moving)
        ) {
            // If currently paused, decrement timer and skip movement
            if (this._pauseTimer > 0) {
                this._pauseTimer -= delta;
                if (this._pauseTimer < 0) this._pauseTimer = 0;
                this.currentDelta = this.pos.sub(this._lastPos);
                return;
            }

            // Move platform and check if it reached start/end
            const reached = this.moveBetweenStartAndEnd(delta);

            // If reached an endpoint, start pause timer
            if (reached && this.pauseDuration > 0) {
                this._pauseTimer = this.pauseDuration;
            }
        }

        // Mode 3: Move toward end goal when pressure plate pressed, otherwise return to starting position
        if (this.movementMode === MovementMode.PressurePlateReturn) {
            if (this._pressureActive) {
                this.moveToTarget(this.end, delta);
            } else {
                this.moveToTarget(this.start, delta);
            }
        }

        // Calculate displacement after moving
        this.currentDelta = this.pos.sub(this._lastPos);
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
}
