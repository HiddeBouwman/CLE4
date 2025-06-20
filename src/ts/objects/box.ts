import {
    Actor,
    CollisionType,
    CompositeCollider,
    Shape,
    Vector,
} from "excalibur";
import { Resources } from "../resources.ts";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";

export class Box extends Actor {
    #roundedbox = new CompositeCollider([
        Shape.Box(33, 33, new Vector(0.5, 0.5), new Vector(0, 0)),
        //Shape.Box(60, 10, new Vector(0.5, 0.5), new Vector(0, 35)),
        //Shape.Circle(5, new Vector(26, 23)),
        //Shape.Circle(5, new Vector(-26, 23)),
    ]);
    private topPlatform: Actor;
    private isPushing: boolean = false;
    private pushSoundTimer: number = 0;
    private wasPushing: boolean = false;
    private pushingPlayer: Player | null = null;
    private pushDisconnectTimer: number = 0;
    private lastYVelocity: number = 0;

    constructor(x: number, y: number) {
        super({
            width: 64,
            height: 64,
            collisionType: CollisionType.Active,
        });
        this.graphics.use(Resources.Box.toSprite());
        this.pos = new Vector(x * 32, y * 32);
        this.scale = new Vector(2, 2);
        this.collider.set(this.#roundedbox);
        this.addTag("ground");

        this.body.mass = 1000;
        this.body.friction = 1000;
        this.body.bounciness = 0.1;
    }

    onInitialize(engine) {
        this.on("collisionstart", (evt) => {
            if (evt.other.owner instanceof Floor) {
                // Check of de box hard genoeg valt
                if (Math.abs(this.lastYVelocity) > 20) {
                    Resources.MetalSlam.play();
                }
            }
        });
    }

    onPreUpdate(engine, delta) {
        let pushing = false;
        let pushingPlayer: Player | null = null;

        if (this.scene) {
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
                            pushingPlayer = actor;
                            break;
                        }
                    }
                }
            }
        }

        // Houd de speler verbonden zolang deze duwt, met een kleine "grace period"
        if (pushing) {
            this.pushingPlayer = pushingPlayer;
            this.pushDisconnectTimer = 200; // ms, bijv. 0.2 seconde
        } else if (this.pushingPlayer) {
            if (this.pushDisconnectTimer > 0) {
                this.pushDisconnectTimer -= delta;
                pushing = true; // Blijf nog even in push-state
            } else {
                this.pushingPlayer = null;
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

        this.lastYVelocity = this.vel.y;
    }
}