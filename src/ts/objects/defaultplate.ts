import { PressurePlate } from "./pressureplate";
import { IMovablePlatform } from "./platform";
import { Resources } from "../resources";
import { Player } from "../player";
import { Box } from "./box";
import { Engine } from "excalibur";

/**
 * A green pressure plate that activates one or more platforms when pressed.
 * Can be activated by players or a specific box.
 *
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 * @param velocityBoost - Vertical velocity boost applied to players (usually 0 for this plate type)
 * @param targetPlatform - The platform(s) to activate when pressed (single or array)
 * @param targetBox - Optional specific box that can activate this plate (in addition to players)
 */
export class DefaultPlate extends PressurePlate {
    protected targetPlatforms: IMovablePlatform[];
    private targetBox?: Box;
    private _activeObjects = new Set<any>();


    constructor(
        x: number,
        y: number,
        velocityBoost: number,
        targetPlatform: IMovablePlatform | IMovablePlatform[], // accepteer array of los object
        targetBox?: Box
    ) {
        super(
            x,
            y,
            velocityBoost,
            Resources.pressurePlateGreenBase.toSprite(),
        );
        // Altijd opslaan als array
        this.targetPlatforms = Array.isArray(targetPlatform) ? targetPlatform : [targetPlatform];
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
                if (other && (other instanceof Player || (this.targetBox && other === this.targetBox))) {
                    this._activeObjects.add(other);
                    if (this._activeObjects.size === 1) {
                        Resources.Button.play();
                        // Activeer ALLE platforms
                        for (const platform of this.targetPlatforms) {
                            if (typeof platform.registerPressurePlateActivated === "function") {
                                platform.registerPressurePlateActivated();
                            } else {
                                platform.startMoving();
                            }
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
                        // Deactiveer ALLE platforms
                        for (const platform of this.targetPlatforms) {
                            if (typeof platform.registerPressurePlateDeactivated === "function") {
                                platform.registerPressurePlateDeactivated();
                            } else {
                                platform.stopMoving();
                            }
                        }
                        this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
                    }
                }
            }
        });
    }
}