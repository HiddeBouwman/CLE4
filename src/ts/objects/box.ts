import {
    Actor,
    CollisionType,
    CompositeCollider,
    Shape,
    Vector,
} from "excalibur";
import { Resources } from "../resources.ts";
import { Player } from "../player.ts";

export class Box extends Actor {
    #roundedbox = new CompositeCollider([
        Shape.Box(60, 60, new Vector(0.5, 0.5), new Vector(0, 0)),
        //Shape.Box(60, 10, new Vector(0.5, 0.5), new Vector(0, 35)),
        //Shape.Circle(5, new Vector(26, 23)),
        //Shape.Circle(5, new Vector(-26, 23)),
    ]);
    private topPlatform: Actor;
    private isPushing: boolean = false;
    private pushSoundTimer: number = 0;
    private wasPushing: boolean = false;

    constructor(x: number, y: number) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Active,
        });
        this.graphics.use(Resources.Box.toSprite());
        this.pos = new Vector(x * 32, y * 32);
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

    onPreUpdate(engine, delta) {
        let pushing = false;
        if (this.scene) { // null-check!
            for (const actor of this.scene.actors) {
                if (actor instanceof Player) {
                    const dx = Math.abs(actor.pos.x - this.pos.x);
                    const dy = Math.abs(actor.pos.y - this.pos.y);
                    if (dx < 60 && dy < 60) {
                        if (
                            (actor.vel.x > 10 && actor.pos.x < this.pos.x) ||
                            (actor.vel.x < -10 && actor.pos.x > this.pos.x)
                        ) {
                            pushing = true;
                            break;
                        }
                    }
                }
            }
        }
        this.isPushing = pushing;

        // --- BoxMove sound logic ---
        if (this.isPushing) {
            if (Resources.BoxMove.isPlaying() === false) {
                Resources.BoxMove.loop = true;
                Resources.BoxMove.play();
            }
        } else {
            if (Resources.BoxMove.isPlaying()) {
                Resources.BoxMove.stop();
            }
        }
        // --- Einde BoxMove sound logic ---

        // PlayerPush geluid blijft zoals het was (optioneel)
        if (this.isPushing) {
            this.pushSoundTimer -= delta;
            if (this.pushSoundTimer <= 0) {
                Resources.PlayerPush.play();
                this.pushSoundTimer = 500; // elke 0.5 seconde
            }
        }

        if (!this.isPushing && this.wasPushing) {
            this.pushSoundTimer = 0;
        }
        this.wasPushing = this.isPushing;
    }
}
