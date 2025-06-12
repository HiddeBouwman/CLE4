import { Actor, CollisionType, DegreeOfFreedom, Keys, Vector } from "excalibur";
import { Resources } from "../resources.ts";

export class Box extends Actor {
    constructor(x, y) {
        super({
            width: 100,
            height: 100,
            collisionType: CollisionType.Active
        });
        this.graphics.use(Resources.Box.toSprite());
        this.pos = new Vector(x, y)
    }
}