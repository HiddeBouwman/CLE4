import { Actor, CollisionType, Vector, Engine } from "excalibur";
import { Resources } from "../resources.ts";
import { Floor } from "../floor.ts";
import { TrapPlate } from "./trapPlate.ts";

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
        this.body.bounciness = 100;
        this.frameCounter = 0
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            if (evt.other.owner instanceof Floor) {
                this.body.applyLinearImpulse(new Vector(Math.random() * 100 - 50, -9000));
            }
            if (evt.other.owner instanceof TrapPlate) {
                this.body.applyLinearImpulse(new Vector(Math.random() * 100 - 50, -9000));
            }
        });

        if (Math.abs(this.vel.y) < 0.01) {
            this.body.applyLinearImpulse(new Vector(Math.random() * 100 - 50, -9000));
            // y has (almost) stopped moving
        }
    }

    onPostUpdate() {
        this.frameCounter++;
        if (this.frameCounter > 300) {
            this.kill();
        }
    }

}