import { Actor, CollisionType, DegreeOfFreedom, Keys, Vector } from "excalibur";
import { Resources } from "./resources.ts";
import { Floor } from "./floor.ts";

type PlayerControls = {
    left: Keys;
    right: Keys;
    rod: Keys;
    catch: Keys;
};

const Controls: { player1: PlayerControls; player2: PlayerControls } = {
    player1: {
        left: Keys.A,
        right: Keys.D,
        rod: Keys.W,
        catch: Keys.S,
    },
    player2: {
        left: Keys.Left,
        right: Keys.Right,
        rod: Keys.Up,
        catch: Keys.Down,
    },
};

export class Player extends Actor {
    #playerNumber;
    #isOnGround;
    controls: PlayerControls;

    constructor(x, y, playerNumber) {
        super({ width: 100, height: 100, collisionType: CollisionType.Active });

        //important requirements for a Actor
        this.scale = new Vector(0.5, 0.5);
        this.pos = new Vector(x, y);

        //player identifier
        this.#playerNumber = playerNumber;
        this.controls = playerNumber === 1
            ? Controls.player1
            : Controls.player2;

        this.graphics.use(Resources.Fish.toSprite());
        //restrictions
        //physics
        this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
        this.body.bounciness = 0.1;

        //player status
        this.#isOnGround = true;
    }

    //on load register player collisions
    onInitialize(engine) {
        this.on("collisionstart", (event) => this.hitSomething(event));
    }

    //check collisions between players and other objects
    hitSomething(event) {
        if (event.other.owner instanceof Floor) {
            this.#isOnGround = true;
        }
    }

    //if on ground jump and reset on ground status
    jump() {
        if (this.#isOnGround) {
            this.body.applyLinearImpulse(new Vector(0, -6000));
            this.#isOnGround = false;
        }
    }

    onPreUpdate(engine) {
        let kb = engine.input.keyboard;

        //simpel jumping based on player and controles + collision with ground
        if (this.#playerNumber === 1 && kb.wasPressed(Keys.Space)) {
            this.jump();
        }

        if (this.#playerNumber === 2 && kb.wasPressed(Keys.ArrowUp)) {
            this.jump();
        }
    }
}
