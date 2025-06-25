import { Actor, CollisionType, Vector, Engine } from "excalibur";
import { Resources } from "../resources.ts";
import { Floor } from "../floor.ts";
import { TrapPlate } from "./trapPlate.ts";
import { Player } from "../player.ts";

/**
 * Hazardous spike ball that bounces around and damages players.
 * Created by SpikeBallTrap and disappears after a set time.
 * Makes metallic sound effects when bouncing.
 * 
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 */
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

    //set collision based results depending on the object
    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            if (evt.other.owner instanceof Player) {

                // Find current scene.
                const engineScenes = engine.scenes as Record<string, any>;
                let sceneKey = Object.keys(engineScenes).find(
                    key => engineScenes[key] === this.scene
                );
                sceneKey = (this.scene as any).levelKey || sceneKey;
                if (sceneKey) {
                    engine.goToScene(sceneKey);
                } else {
                    console.warn("Problem with scene name or not found....");
                }
            }
        });
        this.on("collisionstart", (evt) => {
            // Speel MetalSlam af bij elke botsing met Floor of TrapPlate, als de spikeball een beetje valt
            if (
                (evt.other.owner instanceof Floor || evt.other.owner instanceof TrapPlate) &&
                Math.abs(this.vel.y) > 20 // lagere drempel, zodat het vaker afspeelt
            ) {
                Resources.MetalSlam.play();
            }

            if (evt.other.owner instanceof Floor) {
                this.body.applyLinearImpulse(new Vector(Math.random() * 100 - 50, -9000));
            }
            if (evt.other.owner instanceof TrapPlate) {
                this.body.applyLinearImpulse(new Vector(Math.random() * 100 - 50, -9000));
            }
            console.log("User activates spikeball trap.")
        });

        //reset vertical velocity if it is too low
        if (Math.abs(this.vel.y) < 0.01) {
            this.body.applyLinearImpulse(new Vector(Math.random() * 100 - 50, -9000));
        }
    }


    //count frames and kill ball after 5 seconds
    onPostUpdate() {
        this.frameCounter++;
        if (this.frameCounter > 300) {
            this.kill();
            console.log("It will disappear.")
        }
    }

}