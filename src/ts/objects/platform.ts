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
    spriteScale: Vector;
    boostForPlayers: number[];

    constructor(
        x: number, // starting position
        y: number, // starting position
        width: number, // platform width (unused)
        height: number, // platform height (unused)
        platformType: PlatformType, // assigns sprite
        colliderWidth: number, // platform width
        colliderHeight: number, // platform height
        colliderOffset: Vector, // platform collisionbox offset
        spriteScale: Vector = new Vector(1, 1), // Ability to change sprite scale if needed
        boostForPlayers: number[] = [] // Default = none, other options are [1], [2], or [1, 2]
    ) {
        super({
            width,
            height,
            collisionType: CollisionType.Fixed
        });

        this.collider.useBoxCollider(colliderWidth, colliderHeight, colliderOffset);
        this.platformType = platformType;
        this.pos = new Vector(x, y);
        this.addTag('ground');
        this.spriteScale = spriteScale;
        this.boostForPlayers = boostForPlayers;

        const sprite = PlatformSpriteMap[platformType].toSprite();
        sprite.scale = this.spriteScale; // Apply scale to sprite if changed with spriteScale value.
        this.graphics.use(sprite);
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
