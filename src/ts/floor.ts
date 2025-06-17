import {
    Actor,
    CollisionType,
    NineSlice,
    NineSliceConfig,
    NineSliceStretch,
    Vector,
} from "excalibur";
import { Resources } from "./resources.ts";
import { CollisionGroup } from "./collision.ts";

/**
 * Creates a new Floor instance.
 *
 * @param x - The x-coordinate position of the floor.
 * @param y - The y-coordinate position of the floor.
 * @param width - The width of the floor in pixels.
 * @param height - The height of the floor in pixels.
 */
export class Floor extends Actor {
    #myNineSlice: NineSlice;
    boostForPlayers: number[]; // Boost option

    constructor(x: number, y: number, width: number, height: number, boostForPlayers: number[] = []) {
        super(
            {
                width: width * 32 - 23,
                height: height * 32 - 23,
                collisionType: CollisionType.Fixed,
                collisionGroup: CollisionGroup.Ground
            },
        );

        const myNineSliceConfig: NineSliceConfig = {
            width: width * 32,
            height: height * 32,
            source: Resources.Floor,
            sourceConfig: {
                width: 96,
                height: 96,
                topMargin: 32,
                leftMargin: 32,
                bottomMargin: 32,
                rightMargin: 32,
            },
            destinationConfig: {
                drawCenter: true,
                horizontalStretch: NineSliceStretch.TileFit,
                verticalStretch: NineSliceStretch.TileFit,
            },
        };

        this.#myNineSlice = new NineSlice(myNineSliceConfig);
        this.graphics.use(this.#myNineSlice);
        this.scale = new Vector(2, 2);
        this.addTag('ground')

        // Set anchor to top-left corner (0,0)
        // This makes the position coordinate represent the top-left of the sprite
        // this.anchor = new Vector(0, 0);
        this.pos = new Vector(x * 32, y * 32);
        this.body.collisionType = CollisionType.Fixed;

        this.boostForPlayers = boostForPlayers; // Zet boost spelers
    }
}

// Utility functie om te checken of een floor boost geeft aan een speler
export function isBoostFloorForPlayer(floor: Floor, playerNumber: number): boolean {
    return floor.boostForPlayers.includes(playerNumber);
}
