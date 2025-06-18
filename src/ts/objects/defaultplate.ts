import { PressurePlate } from "./pressureplate";
import { IMovablePlatform } from "./platform";
import { Resources } from "../resources";
import { Player } from "../player";
import { Box } from "./box";
import { Engine } from "excalibur";

export class DefaultPlate extends PressurePlate {
    protected targetPlatform: IMovablePlatform;

    constructor(x: number, y: number, targetPlatform: IMovablePlatform) {
        super(
            x,
            y,
            Resources.pressurePlateGreenBase.toSprite(),
        );
        this.targetPlatform = targetPlatform;
    }

    onInitialize(engine: Engine) {
        // When something starts colliding with the plate
        this.on("collisionstart", (evt) => {
            const other = evt.other.owner;
            if (other && (other instanceof Player || other instanceof Box)) {
                this._activeCount++;
                // If this is the first object, activate the plate
                if (this._activeCount === 1) {
                    // Use new method for multi-plate support
                    Resources.buttonSound.play();
                    if (typeof this.targetPlatform.registerPressurePlateActivated === "function") {
                        this.targetPlatform.registerPressurePlateActivated();
                    } else {
                        this.targetPlatform.startMoving();
                    }
                    this.plateSprite.graphics.use(Resources.PressurePlateGreenActivated.toSprite());
                }
            }
        });

        // When something stops colliding with the plate
        this.on("collisionend", (evt) => {
            const other = evt.other.owner;
            if (other && (other instanceof Player || other instanceof Box)) {
                this._activeCount = Math.max(0, this._activeCount - 1);
                if (this._activeCount === 0) {
                    // Use new method for multi-plate support
                    if (typeof this.targetPlatform.registerPressurePlateDeactivated === "function") {
                        this.targetPlatform.registerPressurePlateDeactivated();
                    } else {
                        this.targetPlatform.stopMoving();
                    }
                    this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
                }
            }
        });
    }
}