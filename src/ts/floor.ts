import { Actor, Vector, CollisionType, NineSlice, NineSliceConfig, NineSliceStretch } from "excalibur"
import { Resources } from './resources.ts'

export class Floor extends Actor {
    private myNineSlice: NineSlice;

    constructor(x: number, y: number) {
        super();
        

        const myNineSliceConfig: NineSliceConfig = {
            width: 96,
            height: 96, 
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

        this.myNineSlice = new NineSlice(myNineSliceConfig);
        this.graphics.use(this.myNineSlice);

        this.pos = new Vector(x, y);
        this.body.collisionType = CollisionType.Fixed;
    }
}