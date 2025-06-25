import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "../resources.ts";
import { Player } from "../player.ts";

export enum PlatformType {
    DefaultPlatform,
    PurplePlatform,
    YellowPlatform,
    PurpleYellowPlatform
}

/**
 * Base platform class that serves as a foundation for all platform types.
 * Handles collision, graphics, and basic movement detection with sound effects.
 * 
 * @param x - X coordinate in grid units (will be multiplied by 32)
 * @param y - Y coordinate in grid units (will be multiplied by 32)
 * @param width - Width of the platform actor
 * @param height - Height of the platform actor
 * @param platformType - Type of platform from PlatformType enum, determines sprite
 * @param colliderWidth - Width of the collision box
 * @param colliderHeight - Height of the collision box
 * @param colliderOffset - Offset position of the collision box
 * @param spriteScale - Scale factor for the platform sprite (default: Vector(1, 1))
 * @param boostForPlayers - Array of player numbers that receive speed boost on this platform (default: [])
 */
export class Platform extends Actor {
    platformType: PlatformType;
    spriteScale: Vector;
    boostForPlayers: number[];
    protected _lastPos: Vector = Vector.Zero;
    private _actuallyMoving: boolean = false;
    private _wasActuallyMoving: boolean = false;
    private startSoundPlaying: boolean = false;
    private movingSoundPlaying: boolean = false;
    public currentDelta: Vector = Vector.Zero; // <-- Voeg deze toe

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        platformType: PlatformType,
        colliderWidth: number,
        colliderHeight: number,
        colliderOffset: Vector,
        spriteScale: Vector = new Vector(1, 1),
        boostForPlayers: number[] = []
    ) {
        super({
            width,
            height,
            collisionType: CollisionType.Fixed
        });

        this.collider.useBoxCollider(colliderWidth, colliderHeight, colliderOffset);
        this.platformType = platformType;
        this.pos = new Vector(x * 32, y * 32);
        this.addTag('ground');
        this.spriteScale = spriteScale;
        this.boostForPlayers = boostForPlayers;

        const sprite = Resources[PlatformType[platformType]].toSprite();
        sprite.scale = this.spriteScale;
        this.graphics.use(sprite);
    }

    // Helper om te checken of een speler dichtbij is
    private isPlayerNearby(): boolean {
        if (!this.scene) return false;
        for (const actor of this.scene.actors) {
            if (actor instanceof Player) {
                const distance = this.pos.distance(actor.pos);
                if (distance < 525) {
                    return true;
                }
            }
        }
        return false;
    }

    onPreUpdate(engine, delta) {
        // Detecteer echte beweging
        if (!this._lastPos) this._lastPos = this.pos.clone();
        this._wasActuallyMoving = this._actuallyMoving;
        this._actuallyMoving = !this.pos.equals(this._lastPos);

        // --- Geluidseffecten ---
        const playerNearby = this.isPlayerNearby();

        if (this._actuallyMoving && !this._wasActuallyMoving && playerNearby) {
            if (!this.startSoundPlaying) {
                Resources.PlatformMoving.volume = 0.1
                Resources.PlatformStartMoving.play();
                this.startSoundPlaying = true;
                this.movingSoundPlaying = false;
            }
        }

        if (this._actuallyMoving && playerNearby) {
            if (!Resources.PlatformMoving.isPlaying()) {
                Resources.PlatformMoving.volume = 0.2
                Resources.PlatformMoving.loop = true;
                Resources.PlatformMoving.play();
                this.movingSoundPlaying = true;
            }
        } else if (this.movingSoundPlaying) {
            Resources.PlatformMoving.stop();
            this.movingSoundPlaying = false;
        }

        if (!this._actuallyMoving && this._wasActuallyMoving && playerNearby) {
            Resources.PlatformStopMoving.volume = 0.2
            Resources.PlatformStopMoving.play();
            this.startSoundPlaying = false;
        }

        if (!this._actuallyMoving) {
            this.startSoundPlaying = false;
        }

        this.currentDelta = this.pos.sub(this._lastPos);
    }

    // Voeg toe:
    onPostUpdate(engine, delta) {
        // Nu pas _lastPos bijwerken, NA physics en NA player carrier!
        this._lastPos = this.pos.clone();
    }
}

// Interface for platforms that can be moved (by pressure plates)
/**
 * Interface for platforms that can be moved by pressure plates or other triggers.
 * Implemented by platform classes that need to respond to activation/deactivation events.
 */
export interface IMovablePlatform {
    startMoving(): void;
    stopMoving(): void;
    registerPressurePlateActivated?(): void;
    registerPressurePlateDeactivated?(): void;
}

/**
 * Utility function to check if a platform provides a speed boost for a specific player.
 * 
 * @param platform - The platform to check
 * @param playerNumber - The player number to check for boost (1 or 2)
 * @returns True if the platform boosts the specified player
 */
export function isBoostPlatformForPlayer(platform: Platform, playerNumber: number): boolean {
    return platform.boostForPlayers.includes(playerNumber);
}
