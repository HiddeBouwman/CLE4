import {
    Actor,
    CollisionType,
    NineSlice,
    NineSliceConfig,
    NineSliceStretch,
    Vector,
} from "excalibur";
import { Resources } from "./resources.ts";

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

    constructor(x: number, y: number, width: number, height: number) {
        super(
            {
                width: width * 32 - 20,
                height: height * 32 - 18,
                collisionType: CollisionType.Fixed,
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

        // Set anchor to top-left corner (0,0)
        // This makes the position coordinate represent the top-left of the sprite
        // this.anchor = new Vector(0, 0);
        this.pos = new Vector(x * 32, y * 32);
        this.body.collisionType = CollisionType.Fixed;
    }
}
