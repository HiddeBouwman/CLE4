import {
    Actor,
    Animation,
    AnimationStrategy,
    BodyComponent,
    CollisionType,
    CompositeCollider,
    DegreeOfFreedom,
    Keys,
    Shape,
    Side,
    Sprite,
    SpriteSheet,
    Vector,
} from "excalibur";
import type { Collider, CollisionContact, Engine } from "excalibur";
import { Resources } from "./resources.ts";
import { CollisionGroup } from "./collision.ts";
import { MovingPlatform } from "./objects/MovingPlatform.ts";
import { PlatformType, isBoostPlatformForPlayer } from "./objects/platform.ts";
import { Box } from "./objects/box.ts";
import { Block } from "./objects/block.ts";

import { Floor, isBoostFloorForPlayer } from "./floor.ts";
import { SpikeBall } from "./objects/spikeBall.ts";

type PlayerControls = {
    left: Keys;
    right: Keys;
    up: Keys;
    down: Keys;
    reset: Keys;
};

export const Controls: { player1: PlayerControls; player2: PlayerControls } = {
    player1: {
        left: Keys.A,
        right: Keys.D,
        up: Keys.W,
        down: Keys.S,
        reset: Keys.R
    },
    player2: {
        left: Keys.Left,
        right: Keys.Right,
        up: Keys.Up,
        down: Keys.Down,
        reset: Keys.R

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
    private _carrierPlatform: MovingPlatform | null = null; // Assigns player to a platform (in order to "stick to it")
    private _pendingCarrierDelta: Vector = Vector.Zero;
    private _lastEngine: Engine | null = null;
    private _lastDelta: number = 16;
    private idleTimer: number = 0;
    private lastXSpeed: number = 0;
    private idleCooldown: number = 0;
    private lastYVelocity: number = 0;

    #spriteSheet: SpriteSheet;
    #idleAnimation: Animation;
    #walkAnimation: Animation;

    private initialX: number;
    private initialY: number;

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

        //Store initial position
        this.initialX = x;
        this.initialY = y;

        //Init player controls
        this.controls = playerNumber === 1
            ? Controls.player1
            : Controls.player2;

        this.#spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.CharacterSheet,
            grid: {
                rows: 4,
                columns: 3,
                spriteWidth: 32,
                spriteHeight: 32,
            },
        });

        // Create animations using the sprite sheet - using indices (0-based)
        let idleFrames: number[];
        let walkFrames: number[];

        if (playerNumber === 1) {
            // Repeat frame 0 more often to make it appear longer in the animation
            idleFrames = [0, 1, 2];
            walkFrames = [3, 4, 5];
        } else {
            idleFrames = [6, 7, 8]; // Repeat frame 6 to emphasize the idle position
            walkFrames = [9, 10, 11];
        }

        this.#idleAnimation = Animation.fromSpriteSheet(
            this.#spriteSheet,
            idleFrames,
            300,
            AnimationStrategy.PingPong,
        );

        this.#walkAnimation = Animation.fromSpriteSheet(
            this.#spriteSheet,
            walkFrames,
            200,
            AnimationStrategy.PingPong,
        );

        // Use idle animation as default
        this.graphics.use(this.#idleAnimation);

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
            //if player die reset level
            this.die(this.scene!.engine);
            console.log(`Player ${this.playerNumber} died to a spike ball!`);
        }
        if (
            other.owner.get(BodyComponent)?.collisionType === CollisionType.Fixed ||
            other.owner.get(BodyComponent)?.collisionType === CollisionType.Active
        ) {
            if (side === Side.Bottom && other.owner.hasTag("ground")) {
                // Landing sound with hard landing
                if (this.lastYVelocity > 750) { // Change this value for sensitivity
                    const landSounds = [
                        Resources.PlayerLand1,
                        Resources.PlayerLand2,
                    ];
                    landSounds[Math.floor(Math.random() * landSounds.length)].play();
                } else if (this.lastYVelocity <= 750) {
                    const softLandSounds = [
                        Resources.PlayerLandSoft1,
                        Resources.PlayerLandSoft2,
                    ]
                    softLandSounds[Math.floor(Math.random() * softLandSounds.length)].play();
                }
                this.#onGround = true;
            }
        }
        // Boost on platform
        if (other.owner instanceof MovingPlatform) {
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
                if (this.playerNumber === 1) {
                    Resources.Player1GetsBoosted.play();
                } else if (this.playerNumber === 2) {
                    Resources.Player2GetsBoosted.play();
                }
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

        if (other.owner instanceof Block && side === Side.Bottom) {
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
                if (this.playerNumber === 1) {
                    Resources.Player1GetsBoosted.play();
                } else if (this.playerNumber === 2) {
                    Resources.Player2GetsBoosted.play();
                }
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
                    other.owner instanceof MovingPlatform &&
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
        if (other.owner instanceof MovingPlatform) {
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
            Resources.PlayerJump.play();
        }
    }

    //player handles death and level reset
    die(engine: Engine) {
        this.kill();
        this.scene!.actors.forEach(actor => {
            if (actor instanceof SpikeBall) {
                actor.kill();
            }
        });


        this.unkill();
        const key = (this.scene as any).levelKey || "level1";
        engine.goToScene(key);
    }

    onPreUpdate(engine: Engine, delta: number) {
        let kb = engine.input.keyboard;

        if (kb.wasPressed(this.controls.reset) && this.scene) {
            // Stop current music
            Resources.gameMusic.stop();
            // Restart current level
            engine.goToScene('level1');
        }

        let xspeed = 0;

        // Movement controls
        if (kb.isHeld(this.controls.left)) {
            xspeed = -1;
        }

        if (kb.isHeld(this.controls.right)) {
            xspeed = 1;
        }

        // Idle detection
        if (xspeed === 0 && Math.abs(this.vel.x) < 1) {
            this.idleTimer += delta;
            if (this.idleTimer > 20000 && this.idleCooldown <= 0) { // Stand still for twenty seconds
                // Play random idle sound
                if (this.playerNumber === 1) {
                    const idleSounds = [
                        Resources.PlayerIdle1,
                        Resources.PlayerIdle2,
                        Resources.PlayerIdle3,
                    ];
                    idleSounds[Math.floor(Math.random() * idleSounds.length)].play();
                } else if (this.playerNumber === 2) {
                    const idleSounds = [
                        Resources.PlayerIdle4,
                        Resources.PlayerIdle5,
                        Resources.PlayerIdle6,
                    ];
                    idleSounds[Math.floor(Math.random() * idleSounds.length)].play();
                }
                this.idleCooldown = 10000; // 10 seconds cooldown for next idle sound
            }
        } else {
            this.idleTimer = 0;
            this.idleCooldown = 0;
        }

        if (this.idleCooldown > 0) {
            this.idleCooldown -= delta;
        }

        // Jump controls
        if (kb.wasPressed(this.controls.up) && this.#onGround) {
            this.jump();
        }

        // Reset action.
        if (kb.wasPressed(this.controls.reset)) {
            this.resetPosition();
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

        // Switch between animations based on movement
        if (Math.abs(this.vel.x) > 50) {
            // If moving, use walk animation
            if (this.graphics.current !== this.#walkAnimation) {
                this.graphics.use(this.#walkAnimation);
            }
            // when moving right (positive x), do flip
            this.graphics.flipHorizontal = this.vel.x > 0;
        } else {
            // If idle, use idle animation
            if (this.graphics.current !== this.#idleAnimation) {
                this.graphics.use(this.#idleAnimation);
                this.graphics.flipHorizontal = false; // Reset flip when idle
            }
        }
        // When player is falling (positive y velocity), set onGround to false
        if (this.vel.y > 100) {
            this.#onGround = false;
        }

        // Platform carrier functionality
        if (this._carrierPlatform) {
            this._pendingCarrierDelta = this._carrierPlatform.currentDelta;
        } else {
            this._pendingCarrierDelta = Vector.Zero;
        }
        // Save vertical velocity before physics update
        this.lastYVelocity = this.vel.y;
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
                Resources.PlayerRun.play();
                console.log("Walking sound started");
            }
        }
    }

    private resetPosition(): void {
        if (this._lastEngine) {
            this._lastEngine.goToScene('level1');
        }
    }
}
