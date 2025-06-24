import { Engine } from "excalibur";
import { PressurePlate } from "./pressureplate";
import { Resources } from "../resources";
import { Player } from "../player";
import { SpikeBallTrap } from "./spikeBallTrap";
import { Box } from "./box";
import { SpikeBall } from "./spikeBall";

/**
 * Orange pressure plate that activates a spike ball trap when pressed.
 * Can be triggered by players or boxes and has a cooldown period.
 * 
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 * @param velocityBoost - Vertical velocity boost (unused in this implementation)
 * @param trap - The SpikeBallTrap to activate when this plate is pressed
 */
export class TrapPlate extends PressurePlate {
    private trap: SpikeBallTrap;
    frameCounter

    constructor(x: number, y: number, velocityBoost: number, trap: SpikeBallTrap) {
        super(
            x,
            y,
            velocityBoost,
            Resources.pressurePlateOrangeBase.toSprite(), // basis sprite
        );
        this.trap = trap;
        this.frameCounter = 0;

        if (this.plateSprite) {
            this.plateSprite.graphics.use(Resources.PressurePlateOrange.toSprite());
        }
        this.addTag('pressurePlate');
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            if ((evt.contact?.colliderB as any)?.activator) {
                Resources.Button.play();
                if (evt.other.owner instanceof Player ||
                    evt.other.owner instanceof Box) {
                    if (this.frameCounter > 120) {
                        this.trap.activate(engine);
                        this.frameCounter = 0;
                    }
                    this.plateSprite.graphics.use(Resources.PressurePlateOrangeActivated.toSprite());
                }
            }
        });

        this.on("collisionend", (evt) => {
            if (
                evt.other.owner instanceof Player ||
                evt.other.owner instanceof Box
            ) {
                this.plateSprite.graphics.use(Resources.PressurePlateOrange.toSprite());
            }
        });
    }

    onPostUpdate() {
        this.frameCounter++
    }
}