import {
    Actor,
    BodyComponent,
    CollisionType,
    CompositeCollider,
    DegreeOfFreedom,
    Keys,
    Shape,
    Side,
    Vector,
} from "excalibur";
import type { Collider, CollisionContact, Engine } from "excalibur";
import { Resources } from "./resources.ts";
import { CollisionGroup } from "./collision.ts";
import { Platform } from "./objects/platform.ts";
import { Box } from "./objects/box.ts"

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
    #capsule = new CompositeCollider([
        Shape.Circle(10, new Vector(0, -20)),
        Shape.Box(40, 40),
        Shape.Circle(10, new Vector(0, 20)),
    ]);


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
        this.scale = new Vector(0.5, 0.5);
        this.pos = new Vector(x, y);

        //Init player controls
        this.controls = playerNumber === 1
            ? Controls.player1
            : Controls.player2;

        // Use graphics.
        this.graphics.use(Resources.Fish.toSprite());

        // Init physics
        this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
        this.body.bounciness = 0.1;
        this.collider.set(this.#capsule)
    }

    onCollisionStart(
        self: Collider,
        other: Collider,
        side: Side,
        contact: CollisionContact,
    ): void {
        const otherBody = other.owner.get(BodyComponent);
        if (
            otherBody?.collisionType === CollisionType.Fixed ||
            otherBody?.collisionType === CollisionType.Active
        ) {
            if (side === Side.Bottom && other.owner.hasTag("ground")) {
                this.#onGround = true;
            }
        }
        // give boost to a player based on the platform
        if (
            other.owner instanceof Platform &&
            other.owner.playerNumber === this.playerNumber
        ) {
            this.speedBoost = true;
            this.jumpBoost = true;
        }
        if (other.owner instanceof Box && side === Side.Bottom) {
            this.vel = new Vector(this.vel.x, 0); // Stop val
            this.#onGround = true;
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
            }
        }
        // reset boost
        if (
            other.owner instanceof Platform &&
            other.owner.playerNumber === this.playerNumber
        ) {
            this.speedBoost = false;
            this.jumpBoost = false;
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

    onPreUpdate(engine) {
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

        // apply horizontal movement
        let speed = this.speedBoost ? 600 : 300;
        let movement = new Vector(xspeed, 0).normalize().scale(speed);
        this.vel = new Vector(movement.x, this.vel.y);
    }
}
