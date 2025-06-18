import { PressurePlate } from "./pressureplate";
import { Resources } from "../resources";
import { Player } from "../player";
import { SpikeBallTrap } from "./spikeBallTrap";

export class TrapPlate extends PressurePlate {
    constructor(x: number, y: number) {
        super(
            x,
            y,
            Resources.pressurePlateBase.toSprite(),
        );
    }

    onInitialize() {
        this.on("collisionstart", (evt) => {
            if (evt.other.owner instanceof Player) { 
                
            }
        });
    }
}