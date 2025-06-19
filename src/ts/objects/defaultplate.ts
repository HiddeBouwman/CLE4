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

        if (this.plateSprite) {
            this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
        }
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            if ((evt.contact?.colliderB as any)?.activator) {
                const other = evt.other.owner;
                if (other && (other instanceof Player || other instanceof Box)) {
                    this._activeCount++;
                    if (this._activeCount === 1) {
                        Resources.Button.play();
                        if (typeof this.targetPlatform.registerPressurePlateActivated === "function") {
                            this.targetPlatform.registerPressurePlateActivated();
                        } else {
                            this.targetPlatform.startMoving();
                        }
                        this.plateSprite.graphics.use(Resources.PressurePlateGreenActivated.toSprite());
                    }
                }
            }
        });

        this.on("collisionend", (evt) => {
            // evt.contact bestaat hier niet, dus check alleen het type van het object
            const other = evt.other.owner;
            if (other && (other instanceof Player || other instanceof Box)) {
                this._activeCount = Math.max(0, this._activeCount - 1);
                if (this._activeCount === 0) {
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