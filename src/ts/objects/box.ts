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
        Shape.Box(60, 60, new Vector(0.5, 0.5), new Vector(0, 0)),
        //Shape.Box(60, 10, new Vector(0.5, 0.5), new Vector(0, 35)),
        //Shape.Circle(5, new Vector(26, 23)),
        //Shape.Circle(5, new Vector(-26, 23)),
    ]);
    private topPlatform: Actor;

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

        // Voeg een fixed platform collider toe aan de bovenkant
        this.topPlatform = new Actor({
            width: 50, // zelfde breedte als box
            height: 2, // dunne collider
            pos: new Vector(0, -32), // bovenop de box (pas aan indien nodig)
            collisionType: CollisionType.Fixed,
        });
        this.topPlatform.addTag("ground");
        this.addChild(this.topPlatform);
    }
}
