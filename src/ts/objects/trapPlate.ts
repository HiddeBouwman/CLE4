import { Engine } from "excalibur";
import { PressurePlate } from "./pressureplate";
import { Resources } from "../resources";
import { Player } from "../player";
import { SpikeBallTrap } from "./spikeBallTrap";

export class TrapPlate extends PressurePlate {
    private trap: SpikeBallTrap;
    frameCounter

    constructor(x: number, y: number, trap: SpikeBallTrap) {
        super(
            x,
            y,
            Resources.pressurePlateBase.toSprite(),
        );
        this.trap = trap;
        this.frameCounter = 0
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            if (evt.other.owner instanceof Player) {
                Resources.buttonSound.play();
                if (this.frameCounter > 120) {
                    this.trap.activate(engine);
                    this.frameCounter = 0;
                }

                this.plateSprite.graphics.use(Resources.PressurePlateGreenActivated.toSprite());
            }
        });

        this.on("collisionend", (evt) => {
            if (evt.other.owner instanceof Player) {
                this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
            }
        });
    }

    onPostUpdate(engine) {
        this.frameCounter++
    }
}