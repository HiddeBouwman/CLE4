import { Actor, Vector, Keys, CollisionType, DegreeOfFreedom } from "excalibur"
import { Resources } from "./resources.ts";
import { Floor } from "./floor.ts";


export class Player extends Actor {
    #playerNumber
    #isOnGround


    constructor(x, y, playerNumber) {
        super({ width: 100, height: 100, collisionType: CollisionType.Active })

        //important requirements for a Actor
        this.scale = new Vector(1.5, 1.5)
        this.pos = new Vector(x, y)

        //player identifier
        this.#playerNumber = playerNumber;

        //sprite(s)
        this.graphics.use(Resources.Fish.toSprite());

        //restrictions
        this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);

        //physics
        this.body.bounciness = 0.1;

        //player status
        this.#isOnGround = true;
    }

    //on load register player collisions
    onInitialize(engine) {
        this.on('collisionstart', (event) => this.hitSomething(event))
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
            this.body.applyLinearImpulse(new Vector(0, -10000));
            this.#isOnGround = false;
        }
    }


    onPreUpdate(engine) {
        let kb = engine.input.keyboard

        //simpel jumping based on player and controles + collision with ground
        if (this.#playerNumber === 1 && kb.wasPressed(Keys.Space)) {
            this.jump()
        }

        if (this.#playerNumber === 2 && kb.wasPressed(Keys.ArrowUp)) {
            this.jump()
        }
    }
}