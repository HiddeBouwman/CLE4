import { PressurePlate } from "./pressureplate";
import { IMovablePlatform } from "./platform";
import { Resources } from "../resources";
import { Player } from "../player";
import { Box } from "./box";
import { Engine } from "excalibur";

export class DefaultPlate extends PressurePlate {
    protected targetPlatform: IMovablePlatform;
    private targetBox: Box;


    constructor(x: number, y: number, targetPlatform: IMovablePlatform, targetBox: Box) {
        super(
            x,
            y,
            Resources.pressurePlateGreenBase.toSprite(),
        );
        this.targetPlatform = targetPlatform;
            this.targetBox = targetBox;

        if (this.plateSprite) {
            this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
        }
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
         
        });
    }
}