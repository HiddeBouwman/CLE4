import { PressurePlate } from "./pressureplate";
import { Resources } from "../resources";
import { Player } from "../player";
import { Engine } from "excalibur";

export class JumpPlate extends PressurePlate {
 

    constructor(x: number, y: number, velocityBoost: number) {
        super(
            x,
            y,
            velocityBoost,
            Resources.pressurePlateGreenBase.toSprite(),
        );
        this.velocityBoost = velocityBoost;

        if (this.plateSprite) {
            this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
        }
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            const other = evt.other.owner;
            if (other instanceof Player) {
                other.vel.y = -Math.abs(other.vel.y) - this.velocityBoost;
            }
        });

        this.on("collisionend", (evt) => {
            const other = evt.other.owner;
            if (other instanceof Player) {

            }
        });
    }
}