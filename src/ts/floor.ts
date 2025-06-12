import { Actor, Vector, CollisionType, NineSlice, NineSliceConfig, NineSliceStretch } from "excalibur"
import { Resources } from './resources.ts'

/**
 * Platoform class, use cordinates and size
 * 
 * @extends Actor
 */
export class Floor extends Actor {
    #myNineSlice: NineSlice;
    /**
     * Creates a new Floor instance.
     * 
     * @param x - The x-coordinate position of the floor.
     * @param y - The y-coordinate position of the floor.
     * @param width - The width of the floor in pixels.
     * @param height - The height of the floor in pixels.
     */
    constructor(x: number, y: number, width: number, height: number) {
        super(
            {width: width, height: height}
        );
        

        const myNineSliceConfig: NineSliceConfig = {
            width: width + 20,
            height: height + 20, 
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
            }
        };

        this.#myNineSlice = new NineSlice(myNineSliceConfig);
        this.graphics.use(this.#myNineSlice);
        this.scale = new Vector(2, 2);

        this.pos = new Vector(x, y);
        this.body.collisionType = CollisionType.Fixed;
    }
}