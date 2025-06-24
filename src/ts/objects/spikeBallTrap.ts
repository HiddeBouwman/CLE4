import { Actor, CollisionType, Vector, Engine } from "excalibur";
import { Resources } from "../resources.ts";
import { SpikeBall } from "./spikeBall.ts";

/**
 * Trap that drops spike balls when activated by a TrapPlate.
 * Creates three spike balls in a row below the trap.
 * 
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 */
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
    activate(engine: Engine) {
        console.log("Spike balls dropped from the trap:");
        for (let i = 0; i < 3; i++) {
            const spikeBall = new SpikeBall(this.pos.x + i * 40 - 40, this.pos.y + 60); 
            engine.add(spikeBall);
        }
    }

}