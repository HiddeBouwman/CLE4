import { Engine } from "excalibur";
import { PressurePlate } from "./pressureplate";
import { Resources } from "../resources";
import { Player } from "../player";
import { SpikeBallTrap } from "./spikeBallTrap";
import { Box } from "./box";
import { SpikeBall } from "./spikeBall";

export class TrapPlate extends PressurePlate {
    private trap: SpikeBallTrap;
    frameCounter

    constructor(x: number, y: number, trap: SpikeBallTrap) {
        super(
            x,
            y,
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