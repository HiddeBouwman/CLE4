import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "../resources.ts";
import { Player } from "../player.ts";

export enum PlatformType {
    DefaultPlatform,
    PurplePlatform,
    YellowPlatform,
    PurpleYellowPlatform
}

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
export interface IMovablePlatform {
    startMoving(): void;
    stopMoving(): void;
    registerPressurePlateActivated?(): void;
    registerPressurePlateDeactivated?(): void;
}

// Utility functie om te checken of een platform boost geeft aan een speler
export function isBoostPlatformForPlayer(platform: Platform, playerNumber: number): boolean {
    return platform.boostForPlayers.includes(playerNumber);
}
