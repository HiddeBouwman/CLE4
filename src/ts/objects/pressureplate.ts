import { Actor, CollisionType, Vector, } from "excalibur";
import { Resources } from "../resources.ts";
import { ElevatorPlatform } from "./elevatorPlatform.ts";
import { Player } from "../player.ts";
import { Box } from "./box.ts";

export class PressurePlate extends Actor {
    private targetPlatform: ElevatorPlatform;

    constructor(x, y, targetPlatform: ElevatorPlatform) {
        super({
            width: 100,
            height: 100,
            collisionType: CollisionType.Fixed
        });
        this.graphics.use(Resources.pressurePlate.toSprite());
        this.pos = new Vector(x, y)
        this.collider.useBoxCollider(30, 5, new Vector(0.5, -2));
        this.targetPlatform = targetPlatform;
    }


    onInitialize(engine) {
        //check for collisions with Player or Box
        this.on("collisionstart", (evt) => {
            const other = evt.other.owner;
            if (other && (other instanceof Player || other instanceof Box)) {
                this.targetPlatform.startElevating();
            }
        });
        //check when Player or Box leaves the pressure plate
        this.on("collisionend", (evt) => {
            const other = evt.other.owner;
            if (other && (other instanceof Player || other instanceof Box)) {
                this.targetPlatform.stopElevating();
            }
        });
    }
}