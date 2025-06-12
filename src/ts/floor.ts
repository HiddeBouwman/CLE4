import { Actor, Vector, CollisionType, NineSlice, NineSliceConfig, NineSliceStretch } from "excalibur"
import { Resources } from './resources.ts'

export class Floor extends Actor {
    private myNineSlice: NineSlice;

    constructor(x, y) {
        super({ width: 900, height: 64 }); 

        const myNineSliceConfig: NineSliceConfig = {
            width: 900,
            height: 64, 
            source: Resources.Floor, 
            sourceConfig: {
                width: 64, 
                height: 64, 
                topMargin: 5,
                leftMargin: 6,
                bottomMargin: 5,
                rightMargin: 6
            },
            destinationConfig: {
                drawCenter: true,
                horizontalStretch: NineSliceStretch.TileFit,
                verticalStretch: NineSliceStretch.TileFit
            }
        };

        this.myNineSlice = new NineSlice(myNineSliceConfig);
        this.graphics.use(this.myNineSlice);

        this.pos = new Vector(x, y);
        this.body.collisionType = CollisionType.Fixed;
    }
}