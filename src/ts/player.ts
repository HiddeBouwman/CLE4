import { Actor, CollisionType, DegreeOfFreedom, Keys, Vector } from "excalibur";
import type { Engine } from "excalibur";
import { Resources } from "./resources.ts";
import { Floor } from "./floor.ts";

type PlayerControls = {
    left: Keys;
    right: Keys;
    up: Keys;
    down: Keys;
};

const Controls: { player1: PlayerControls; player2: PlayerControls } = {
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
    #onFloor: boolean;
    controls: PlayerControls;

    constructor(x: number, y: number, playerNumber: number) {
        super({ width: 100, height: 100, collisionType: CollisionType.Active });

        //important requirements for a Actor
        this.scale = new Vector(0.5, 0.5);
        this.pos = new Vector(x, y);

        //player controls
        this.controls = playerNumber === 1
            ? Controls.player1
            : Controls.player2;

        this.graphics.use(Resources.Fish.toSprite());

        //physics
        this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
        this.body.bounciness = 0.1;
    }

    //on load register player collisions
    onInitialize(engine: Engine) {
        this.on("collisionstart", (e) => this.hitSomething(e));
        this.on("collisionend", (e) => this.leaveObject(e));
    }

    //check collisions between players and other objects
    hitSomething(e) {
        if (e.other.owner instanceof Floor) {
            this.#onFloor = true;
        }
    }
    leaveObject(e) {
        if (e.other.owner instanceof Floor) {
            this.#onFloor = false;
        }
    }

    //if on ground jump and reset on ground status
    jump() {
        this.#onFloor
            ? this.body.applyLinearImpulse(new Vector(0, -6000))
            : null;
    }

    onPreUpdate(engine) {
        let kb = engine.input.keyboard;
        let xspeed = 0;

        if (kb.isHeld(this.controls.left)) {
            xspeed = -1;
        }
        if (kb.isHeld(this.controls.right)) {
            xspeed = 1;
        }
        if (kb.wasPressed(this.controls.up)) {
            this.jump();
        }

        // Apply horizontal movement
        let movement = new Vector(xspeed, 0).normalize().scale(300);
        this.vel = new Vector(movement.x, this.vel.y);
    }
}
