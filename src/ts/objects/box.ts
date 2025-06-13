import { Actor, CollisionType, DegreeOfFreedom, Keys, Vector } from "excalibur";
import { Resources } from "../resources.ts";

export class Box extends Actor {
    constructor(x, y) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Active
        });
        this.graphics.use(Resources.Box.toSprite());
        this.pos = new Vector(x, y)
    }
}