import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "../resources.ts";

export enum PlatformType {
    DefaultPlatform,
    PurplePlatform,
    YellowPlatform,
    PurpleYellowPlatform

    // NeutralPlatform,
    // YellowHorizontalStationary,
    // YellowHorizontalLeft,
    // YellowHorizontalRight,
    // YellowVerticalStationary,
    // YellowVerticalUp,
    // YellowVerticalDown,
    // PurpleHorizontalStationary,
    // PurpleHorizontalLeft,
    // PurpleHorizontalRight,
    // PurpleVerticalStationary,
    // PurpleVerticalUp,
    // PurpleVerticalDown
}

export enum MovementMode {
    Always,             // Platform moves continuously
    PressurePlate,      // Platform moves only when pressure plate is active
    PressurePlateReturn // Platform returns when pressure plate is released
}

// Maps platform types to their corresponding sprites
const PlatformSpriteMap = {
    [PlatformType.DefaultPlatform]: Resources.DefaultPlatform,
    [PlatformType.PurplePlatform]: Resources.PurplePlatform,
    [PlatformType.YellowPlatform]: Resources.YellowPlatform,
    [PlatformType.PurpleYellowPlatform]: Resources.PurpleYellowPlatform

    // [PlatformType.NeutralPlatform]: Resources.NeutralPlatform,
    // [PlatformType.YellowHorizontalStationary]: Resources.YellowPlatformHorizontalStationary,
    // [PlatformType.YellowHorizontalLeft]: Resources.YellowPlatformHorizontalLeft,
    // [PlatformType.YellowHorizontalRight]: Resources.YellowPlatformHorizontalRight,
    // [PlatformType.YellowVerticalStationary]: Resources.YellowPlatformVerticalStationary,
    // [PlatformType.YellowVerticalUp]: Resources.YellowPlatformVerticalUp,
    // [PlatformType.YellowVerticalDown]: Resources.YellowPlatformVerticalDown,
    // [PlatformType.PurpleHorizontalStationary]: Resources.PurplePlatformHorizontalStationary,
    // [PlatformType.PurpleHorizontalLeft]: Resources.PurplePlatformHorizontalLeft,
    // [PlatformType.PurpleHorizontalRight]: Resources.PurplePlatformHorizontalRight,
    // [PlatformType.PurpleVerticalStationary]: Resources.PurplePlatformVerticalStationary,
    // [PlatformType.PurpleVerticalUp]: Resources.PurplePlatformVerticalUp,
    // [PlatformType.PurpleVerticalDown]: Resources.PurplePlatformVerticalDown
};

export class Platform extends Actor {
    platformType: PlatformType; // assigns sprite
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
    boostForPlayers: number[];
    private _activePressurePlates: number = 0; // Tracks active pressure plates
    spriteScale: Vector;

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
        super({
            width,
            height,
            collisionType: CollisionType.Fixed
        });

        // Set the sprite based on the platform type
        this.collider.useBoxCollider(colliderWidth, colliderHeight, colliderOffset);
        this.platformType = platformType;
        this.pos = new Vector(x, y);
        this.addTag('ground');
        this.spriteScale = spriteScale;

        const sprite = PlatformSpriteMap[platformType].toSprite();
        sprite.scale = this.spriteScale; // Apply scale to sprite if changed with spriteScale value.
        this.graphics.use(sprite);

        this.start = start ?? new Vector(x, y);
        this.end = end ?? new Vector(x, y);
        this.speed = speed;
        this.movementMode = movementMode;
        this.pauseDuration = pauseDuration;
        this.boostForPlayers = boostForPlayers;

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

// New and improved boost function on platforms
export function isBoostPlatformForPlayer(platform: Platform, playerNumber: number): boolean {
    return platform.boostForPlayers.includes(playerNumber);
}

// Interface for platforms that can be moved (by pressure plates)
export interface IMovablePlatform {
    startMoving(): void;
    stopMoving(): void;
    // Add these for multi-plate support
    registerPressurePlateActivated?(): void;
    registerPressurePlateDeactivated?(): void;
}