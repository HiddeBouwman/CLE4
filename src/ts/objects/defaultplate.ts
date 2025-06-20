import { PressurePlate } from "./pressureplate";
import { IMovablePlatform } from "./platform";
import { Resources } from "../resources";
import { Player } from "../player";
import { Box } from "./box";
import { Engine } from "excalibur";

export class DefaultPlate extends PressurePlate {
    protected targetPlatform: IMovablePlatform;
    private targetBox?: Box; // Maak optioneel
    private _activeObjects = new Set<any>();


    constructor(x: number, y: number, velocityBoost: number, targetPlatform: IMovablePlatform, targetBox?: Box) {
        super(
            x,
            y,
            velocityBoost,
            Resources.pressurePlateGreenBase.toSprite(),
        );
        this.targetPlatform = targetPlatform;
        this.targetBox = targetBox;

        if (this.plateSprite) {
            this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
        }
        this.addTag('pressureplate');
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            if ((evt.self as any).activator) {
                const other = evt.other.owner;
                // Sta toe: speler OF (box als die bestaat)
                if (other && (other instanceof Player || (this.targetBox && other === this.targetBox))) {
                    this._activeObjects.add(other);
                    if (this._activeObjects.size === 1) {
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
            if ((evt.self as any).activator) {
                const other = evt.other.owner;
                if (other && (other instanceof Player || other instanceof Box)) {
                    this._activeObjects.delete(other);
                    if (this._activeObjects.size === 0) {
                        if (typeof this.targetPlatform.registerPressurePlateDeactivated === "function") {
                            this.targetPlatform.registerPressurePlateDeactivated();
                        } else {
                            this.targetPlatform.stopMoving();
                        }
                        this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
                    }
                }
            }
        });
    }
}