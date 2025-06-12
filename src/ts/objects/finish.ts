import { Actor, Vector, Keys, CollisionType, DegreeOfFreedom } from "excalibur";
import { Scene } from "excalibur";
import { Player } from "../player.ts";
import { Resources } from "../resources.ts";

export class Finish extends Actor {
    constructor(x, y) {
        super({ width: 100, height: 100, collisionType: CollisionType.Active })
        
        this.scale = new Vector(0.5, 0.5)
        this.pos = new Vector(x, y)
        
        this.graphics.use(Resources.Finish.toSprite());
    }

    onInitialize(engine) {
        this.on('collisionstart', (event) => this.hitSomething(event))
    }

    //Check if player collids with the finish (prototype).
    hitSomething(event) {
        if (event.other.owner instanceof Player && this.scene) {
            console.log("We collided.");
            
            // Switch scene back to level select menu.
            this.scene.engine.goToScene('menu');
        }
    }
}