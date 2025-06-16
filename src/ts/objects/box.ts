import {
    Actor,
    CollisionType,
    CompositeCollider,
    Shape,
    Vector,
} from "excalibur";
import { Resources } from "../resources.ts";

export class Box extends Actor {
    #roundedbox = new CompositeCollider([
        Shape.Box(60, 50, new Vector(0.5, 0.5), new Vector(0, -5),),
        Shape.Box(50, 10, new Vector(0.5, 0.5), new Vector(0, 20)),
        Shape.Circle(5, new Vector(26, 23)),
        Shape.Circle(5, new Vector(-26, 23)),
    ]);
    constructor(x: number, y: number) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Active,
        });
        this.graphics.use(Resources.Box.toSprite());
        this.pos = new Vector(x, y);
        this.collider.set(this.#roundedbox);
        this.addTag("ground");

        this.body.mass = 1000;
        this.body.friction = 1000;
        this.body.bounciness = 0.1;
    }
}
