import { Actor, CollisionType, Vector, } from "excalibur";
import { Resources } from "../resources.ts";

export class Box extends Actor {
    constructor(x: number, y: number) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Active
        });
        this.graphics.use(Resources.Box.toSprite());
        this.pos = new Vector(x, y)
        this.collider.useCircleCollider(32);
        this.addTag('ground')

        this.body.mass = 1000; 
        this.body.friction = 0;
        this.body.bounciness = 0.1; 
    }
}