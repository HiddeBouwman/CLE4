import { Actor, CollisionType, Vector, } from "excalibur";
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
        this.collider.useBoxCollider(70, 70);

        this.body.mass = 1000; 
        this.body.friction = 0;
        this.body.bounciness = 0.1; 
    }
}