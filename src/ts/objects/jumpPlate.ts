import { PressurePlate } from "./pressureplate";
import { Resources } from "../resources";
import { Player } from "../player";
import { Engine } from "excalibur";

/**
 * A pressure plate that boosts players upward when stepped on.
 * Does not control any platforms, just provides vertical velocity boost.
 *
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 * @param velocityBoost - Amount of upward velocity boost applied to players
 */
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