import { Actor, CollisionType, Vector, Engine } from "excalibur";
import { Resources } from "../resources.ts";

export class SpikeBallTrap extends Actor {
    constructor(x, y) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Fixed,
        });
        this.scale = new Vector(1, 1);
        this.pos = new Vector(x, y);
        this.rotation = Math.PI / 2;
        this.collider.useBoxCollider(95, 95, new Vector(0.5, 0.5));
        this.graphics.use(Resources.SpikeTrap.toSprite());
        this.addTag("ground");
    }

    //create 3 spike balls right under trap
    DropSpikeBalls() {
        console.log("Spike balls dropped from the trap at position:");
    }

}