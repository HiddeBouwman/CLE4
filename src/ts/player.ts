import {
    Actor,
    BodyComponent,
    CollisionType,
    CompositeCollider,
    DegreeOfFreedom,
    Keys,
    Shape,
    Side,
    Sprite,
    Vector,
} from "excalibur";
import type { Collider, CollisionContact, Engine } from "excalibur";
import { Resources } from "./resources.ts";
import { CollisionGroup } from "./collision.ts";
import {
    isBoostPlatformForPlayer,
    Platform,
    PlatformType,
} from "./objects/platform.ts";
import { Box } from "./objects/box.ts";
import { Floor, isBoostFloorForPlayer } from "./floor.ts";
import { SpikeBall } from "./objects/spikeBall.ts";

type PlayerControls = {
    left: Keys;
    right: Keys;
    up: Keys;
    down: Keys;
};

export const Controls: { player1: PlayerControls; player2: PlayerControls } = {
    player1: {
        left: Keys.A,
        right: Keys.D,
        up: Keys.W,
        down: Keys.S,
    },
    player2: {
        left: Keys.Left,
        right: Keys.Right,
        up: Keys.Up,
        down: Keys.Down,
    },
};

export class Player extends Actor {
    #onGround: boolean = false;
    controls: PlayerControls;
    speedBoost: boolean = false;
    jumpBoost: boolean = false;
    playerNumber: number;
    walkSoundTimer: number = 0;
    #capsule = new CompositeCollider([
        Shape.Circle(8, new Vector(0, -5)),
        Shape.Box(15, 15),
        Shape.Circle(8, new Vector(0, 7)),
    ]);
    private _carrierPlatform: Platform | null = null; // Assigns player to a platform (in order to "stick to it")
    private _pendingCarrierDelta: Vector = Vector.Zero;
    private _lastEngine: Engine | null = null;
    private _lastDelta: number = 16;

    constructor(x: number, y: number, playerNumber: number) {
        super(
            {
                width: 100,
                height: 100,
                collisionType: CollisionType.Active,
                collisionGroup: CollisionGroup.Player,
            },
        );

        this.playerNumber = playerNumber;

        //important requirements for a Actor
        this.scale = new Vector(2, 2);
        this.pos = new Vector(x, y);

        //Init player controls
        this.controls = playerNumber === 1
            ? Controls.player1
            : Controls.player2;

        // Use graphics.
        const player1Sprite = new Sprite({
            image: Resources.CharacterSheet,
            sourceView: {
                x: 32 * 1,
                y: 32 * 0,
                width: 32,
                height: 32,
            },
        });
        const player2Sprite = new Sprite({
            image: Resources.CharacterSheet,
            sourceView: {
                x: 32 * 1,
                y: 32 * 2,
                width: 32,
                height: 32,
            },
        });
        this.graphics.use(playerNumber == 1 ? player1Sprite : player2Sprite);

        // Init physics
        this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
        this.body.bounciness = 0.1;
        this.collider.set(this.#capsule);
    }

    onCollisionStart(
        self: Collider,
        other: Collider,
        side: Side,
        contact: CollisionContact,
    ): void {
        const otherBody = other.owner.get(BodyComponent);
        if (other.owner instanceof SpikeBall) {
            this.kill();
            console.log(`Player ${this.playerNumber} died to a spike ball!`);
        }
        if (
            otherBody?.collisionType === CollisionType.Fixed ||
            otherBody?.collisionType === CollisionType.Active
        ) {
            if (side === Side.Bottom && other.owner.hasTag("ground")) {
                this.#onGround = true;
            }
        }
        // Boost on platform
        if (other.owner instanceof Platform) {
            // Detect if player is on a platform
            if (side === Side.Bottom) {
                this._carrierPlatform = other.owner;
            }
            if (isBoostPlatformForPlayer(other.owner, this.playerNumber)) {
                console.log(
                    `Speler ${this.playerNumber} krijgt BOOST op platformtype:`,
                    PlatformType[other.owner.platformType],
                );
                this.speedBoost = true;
                this.jumpBoost = true;
            } else {
                console.log(
                    `Speler ${this.playerNumber} GEEN boost op platformtype:`,
                    PlatformType[other.owner.platformType],
                );
            }
        }
        if (other.owner instanceof Box && side === Side.Bottom) {
            this.vel = new Vector(this.vel.x, 0); // Stop val
            this.#onGround = true;
        }
        // Boost on floor
        if (other.owner instanceof Floor) {
            if (isBoostFloorForPlayer(other.owner, this.playerNumber)) {
                console.log(
                    `Speler ${this.playerNumber} krijgt BOOST op floor`,
                );
                this.speedBoost = true;
                this.jumpBoost = true;
            } else {
                // Optioneel: loggen als geen boost
                // console.log(`Speler ${this.playerNumber} GEEN boost op floor`);
            }
        }
    }
    onCollisionEnd(
        self: Collider,
        other: Collider,
        side: Side,
        lastContact: CollisionContact,
    ): void {
        const otherBody = other.owner.get(BodyComponent);

        if (
            otherBody?.collisionType === CollisionType.Fixed ||
            otherBody?.collisionType === CollisionType.Active
        ) {
            if (side === Side.Bottom && other.owner.hasTag("ground")) {
                this.#onGround = false;
                // Carry on platform momentum
                if (
                    other.owner instanceof Platform &&
                    this._carrierPlatform === other.owner && this._lastDelta > 0
                ) {
                    // velocity = deltaPos / (deltaTime in seconds)
                    const platformVelocity = other.owner.currentDelta.scale(
                        1000 / this._lastDelta,
                    );
                    this.vel = this.vel.add(platformVelocity);
                }
            }
        }
        // reset boost
        if (other.owner instanceof Platform) {
            // If player leaves platform, unlink carrier
            if (this._carrierPlatform === other.owner) {
                this._carrierPlatform = null;
            }
            if (isBoostPlatformForPlayer(other.owner, this.playerNumber)) {
                console.log(
                    `Speler ${this.playerNumber} verliest BOOST op platformtype:`,
                    PlatformType[other.owner.platformType],
                );
                this.speedBoost = false;
                this.jumpBoost = false;
            }
        }
        if (other.owner instanceof Floor) {
            if (isBoostFloorForPlayer(other.owner, this.playerNumber)) {
                console.log(
                    `Speler ${this.playerNumber} verliest BOOST op floor`,
                );
                this.speedBoost = false;
                this.jumpBoost = false;
            }
        }
    }

    jump() {
        if (this.#onGround) {
            let jumpPower = this.jumpBoost ? 800 : 600;
            this.vel = new Vector(this.vel.x, -jumpPower);
            this.#onGround = false;
            Resources.Jump.play();
        }
    }

    onPreUpdate(engine, delta) {
        this._lastEngine = engine;
        this._lastDelta = delta;

        let kb = engine.input.keyboard;
        let xspeed = 0;

        // Movement controls
        if (kb.isHeld(this.controls.left)) {
            xspeed = -1;
        }
        if (kb.isHeld(this.controls.right)) {
            xspeed = 1;
        }

        // Jump controls
        if (kb.wasPressed(this.controls.up) && this.#onGround) {
            this.jump();
        }

        // Acceleration
        const maxSpeed = this.speedBoost ? 600 : 300; // first number is with speed boost from platform, second number is regular speed
        const acceleration = this.#onGround ? 8000 : 4000; // pixels/sec^2 ? lmao idk (first number is ground speed, second number is air speed)
        const friction = this.#onGround ? 0.2 : 0.8; // lower = quicker braking (first number is ground friction, second number is air friction)

        if (xspeed !== 0) {
            // Accelerate towards input
            this.vel = new Vector(
                // v = v + a * t * direction, but clamp to maxSpeed
                Math.max(
                    Math.min(
                        this.vel.x + xspeed * acceleration * (delta / 1000),
                        maxSpeed,
                    ),
                    -maxSpeed,
                ),
                this.vel.y,
            );
        } else {
            // No input: brake
            this.vel = new Vector(this.vel.x * friction, this.vel.y);
            if (Math.abs(this.vel.x) < 1) this.vel = new Vector(0, this.vel.y);
        }

        // Platform carrier functionality
        if (this._carrierPlatform) {
            this._pendingCarrierDelta = this._carrierPlatform.currentDelta;
        } else {
            this._pendingCarrierDelta = Vector.Zero;
        }
    }

    onPostUpdate(engine, delta) {
        // Apply delta AFTER physics
        if (!this._pendingCarrierDelta.equals(Vector.Zero)) {
            this.pos = this.pos.add(this._pendingCarrierDelta);
        }
        if (this.#onGround && Math.abs(this.vel.x) > 0.1) {
            this.walkSoundTimer -= delta;
            if (this.walkSoundTimer <= 0) {
                this.walkSoundTimer = 300;
                Resources.Walking.play();
                console.log("Walking sound started");
            }
        }
    }
}
