import { Actor, CollisionType, Vector, Engine } from "excalibur";
import { Resources } from "../resources.ts";
import { Player } from "../player.ts";

export class SpikeBall extends Actor {
    constructor(x, y) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Active,
        });
        this.scale = new Vector(1, 1);
        this.pos = new Vector(x, y);
        this.graphics.use(Resources.SpikeBall.toSprite());
        this.body.bounciness = 0.8;
    }

    onInitialize(engine: Engine) {
       
    }
}