import { Actor, CollisionType, Vector, } from "excalibur";
import { Resources } from "../resources.ts";

export class PressurePlate extends Actor {
    constructor(x, y) {
        super({
            width: 100,
            height: 100,
            collisionType: CollisionType.Fixed
        });
        this.graphics.use(Resources.pressurePlate.toSprite());
        this.pos = new Vector(x, y)
        this.collider.useBoxCollider(30, 10);
    }
}