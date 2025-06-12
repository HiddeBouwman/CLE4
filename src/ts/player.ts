import { Actor, CollisionType, DegreeOfFreedom, Keys, Vector } from "excalibur";
import type { Engine } from "excalibur";
import { Resources } from "./resources.ts";
import { Floor } from "./floor.ts";
import { Box } from "./objects/box.ts";

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
    #onFloor: boolean = false;
    controls: PlayerControls;

    constructor(x: number, y: number, playerNumber: number) {
        super({ width: 100, height: 100, collisionType: CollisionType.Active });

        //important requirements for a Actor
        this.scale = new Vector(0.5, 0.5);
        this.pos = new Vector(x, y);
 
        //Init player controls
        this.controls = playerNumber === 1 ? Controls.player1: Controls.player2;
    
        // Use graphics.
        this.graphics.use(Resources.Fish.toSprite());

        // Init physics
        this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
        this.body.bounciness = 0.1;
    }

    //on load register player collisions
    onInitialize(engine: Engine) {
        this.on("collisionstart", (e) => this.hitSomething(e));
        this.on("collisionend", (e) => this.leaveObject(e));
    }

    //check collisions between players and objects.
    hitSomething(e) {
        // Improved collision check
        if (e.other.owner instanceof Floor || e.other.owner instanceof Box) {
            console.log("Hit floor/box"); // Debug log
            this.#onFloor = true;
        }
    }
    leaveObject(e) {
        if (e.other.owner instanceof Floor || e.other.owner instanceof Box) {
            this.#onFloor = false;
        }
    }

    jump() {
        if (this.#onFloor) {
            console.log("Jumping!"); // Debug log
            this.vel = new Vector(this.vel.x, -600); // Adjust jump force as needed
            this.#onFloor = false;
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

        // Jump control - Changed from up to W/Up arrow
        if (kb.wasPressed(this.controls.up) && this.#onFloor) {
            this.jump();
            console.log("Attempting to jump, onFloor:", this.#onFloor); // Debug log
        }

        // Apply horizontal movement
        let movement = new Vector(xspeed, 0).normalize().scale(300);
        this.vel = new Vector(movement.x, this.vel.y);
    }
}
