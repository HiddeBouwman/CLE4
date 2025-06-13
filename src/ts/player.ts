import {
    Actor,
    BodyComponent,
    CollisionType,
    DegreeOfFreedom,
    Keys,
    Side,
    Vector,
} from "excalibur";
import type { Collider, CollisionContact, Engine } from "excalibur";
import { Resources } from "./resources.ts";
import { CollisionGroup } from "./collision.ts";

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
    #isInAir: boolean = true;
    controls: PlayerControls;

    constructor(x: number, y: number, playerNumber: number) {
        super(
            {
                width: 100,
                height: 100,
                collisionType: CollisionType.Active,
                collisionGroup: CollisionGroup.Player,
            },
        );

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
            if (side === Side.Bottom) {
                this.#onGround = true;
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
            this.#onGround = false;
        }
    }

    jump() {
        if (this.#onGround) {
            this.vel = new Vector(this.vel.x, -600);
            this.#onGround = false;
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

        // Apply horizontal movement
        let movement = new Vector(xspeed, 0).normalize().scale(300);
        this.vel = new Vector(movement.x, this.vel.y);
    }
}
