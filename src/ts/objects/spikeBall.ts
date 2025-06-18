import { Actor, CollisionType, Vector, Engine } from "excalibur";
import { Resources } from "../resources.ts";
import { Player } from "../player.ts";

export class SpikeBall extends Actor {
    frameCounter

    constructor(x, y) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Active,
        });
        this.scale = new Vector(0.03, 0.03);
        this.pos = new Vector(x, y);
        this.graphics.use(Resources.SpikeBall.toSprite());
        this.collider.useCircleCollider(530, new Vector(0.5, 0.5));
        this.body.bounciness = 0.8;
        this.frameCounter = 0
    }

    oninInitialize() {
        
    }

    onPostUpdate() {
        this.frameCounter++;
        if (this.frameCounter > 300) { 
            this.kill();
        }
    }

}