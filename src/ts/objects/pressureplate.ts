import { Actor, CollisionType, Vector, } from "excalibur";
import { Resources } from "../resources.ts";
import { ElevatorPlatform } from "./elevatorPlatform.ts";
import { Player } from "../player.ts";

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
        this.on("collisionstart", (evt) => {
            if (evt.other.owner && evt.other.owner instanceof Player) {
                this.targetPlatform.startElevating();
            }
        });
        this.on("collisionend", (evt) => {
            if (evt.other.owner && evt.other.owner instanceof Player) {
                this.targetPlatform.stopElevating();
            }
        });
    }
}