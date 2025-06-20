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
import { isBoostPlatformForPlayer, PlatformType } from "./objects/platform.ts";
import { AlwaysMovingPlatform } from "./objects/AlwaysMovingPlatform.ts";
import { PressurePlatePlatform } from "./objects/PressurePlatePlatform.ts";
import { PressurePlateReturnPlatform } from "./objects/PressurePlateReturnPlatform.ts";
import { TwoPlatePlatform } from "./objects/twoPlatePlatform.ts";
import { SpikeBall } from "./objects/spikeBall.ts";
import { Floor, isBoostFloorForPlayer } from "./floor.ts";
import { Box } from "./objects/box.ts";
import { Block } from "./objects/block.ts";
import { Cosmetic } from "./cosmetic.ts";

// Type voor elk bewegend platform
type AnyMovingPlatform =
    | AlwaysMovingPlatform
    | PressurePlatePlatform
    | PressurePlateReturnPlatform;
function isMovingPlatform(owner: any): owner is AnyMovingPlatform {
    return owner instanceof AlwaysMovingPlatform ||
        owner instanceof PressurePlatePlatform ||
        owner instanceof PressurePlateReturnPlatform;
}

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
        reset: Keys.R,
    },
    player2: {
        left: Keys.Left,
        right: Keys.Right,
        up: Keys.Up,
        down: Keys.Down,
        reset: Keys.R,
    },
};

export class Player extends Actor {
    #onGround: boolean = true;
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
    private _carrierPlatform: AnyMovingPlatform | null = null; // Assigns player to a platform (in order to "stick to it")
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

    private lastBoostSource: Actor | null = null;

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
            const sprite0 = new Sprite({
                image: Resources.CharacterSheet,
                sourceView: {
                    x: 32 * 0,
                    y: 0,
                    width: 32,
                    height: 32,
                },
            });
            const sprite1 = new Sprite({
                image: Resources.CharacterSheet,
                sourceView: {
                    x: 32 * 1,
                    y: 0,
                    width: 32,
                    height: 32,
                },
            });
            const sprite2 = new Sprite({
                image: Resources.CharacterSheet,
                sourceView: {
                    x: 32 * 2,
                    y: 0,
                    width: 32,
                    height: 32,
                },
            });
            this.#idleAnimation = new Animation({
                frames: [
                    { graphic: sprite0, duration: 2010 },
                    { graphic: sprite1, duration: 100 },
                    { graphic: sprite2, duration: 100 },
                ],
                strategy: AnimationStrategy.PingPong,
            });
            walkFrames = [3, 4, 5];
        } else {
            const sprite0 = new Sprite({
                image: Resources.CharacterSheet,
                sourceView: {
                    x: 32 * 0,
                    y: 32 * 2,
                    width: 32,
                    height: 32,
                },
            });
            const sprite1 = new Sprite({
                image: Resources.CharacterSheet,
                sourceView: {
                    x: 32 * 1,
                    y: 32 * 2,
                    width: 32,
                    height: 32,
                },
            });
            const sprite2 = new Sprite({
                image: Resources.CharacterSheet,
                sourceView: {
                    x: 32 * 2,
                    y: 32 * 2,
                    width: 32,
                    height: 32,
                },
            });
            this.#idleAnimation = new Animation({
                frames: [
                    { graphic: sprite0, duration: 2000 },
                    { graphic: sprite1, duration: 100 },
                    { graphic: sprite2, duration: 100 },
                ],
                strategy: AnimationStrategy.PingPong,
            });
            walkFrames = [9, 10, 11];
        }

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
        
        // this.addChild(new Cosmetic(playerNumber));
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
            other.owner.get(BodyComponent)?.collisionType ===
                CollisionType.Fixed ||
            other.owner.get(BodyComponent)?.collisionType ===
                CollisionType.Active
        ) {
            if (side === Side.Bottom && other.owner.hasTag("ground")) {
                // Landing sound with hard landing
                if (this.lastYVelocity > 750) { // Change this value for sensitivity
                    const landSounds = [
                        Resources.PlayerLand1,
                        Resources.PlayerLand2,
                    ];
                    landSounds[Math.floor(Math.random() * landSounds.length)]
                        .play();
                } else if (this.lastYVelocity <= 750) {
                    const softLandSounds = [
                        Resources.PlayerLandSoft1,
                        Resources.PlayerLandSoft2,
                    ];
                    softLandSounds[
                        Math.floor(Math.random() * softLandSounds.length)
                    ].play();
                }
                this.#onGround = true;
            }
        }
        // Boost on platform
        if (
            other.owner &&
            (other.owner instanceof AlwaysMovingPlatform ||
                other.owner instanceof PressurePlatePlatform ||
                other.owner instanceof PressurePlateReturnPlatform ||
                other.owner instanceof TwoPlatePlatform) &&
            side === Side.Bottom // <-- alleen als je OP het platform landt!
        ) {
            const platform = other.owner as AnyMovingPlatform;
            if (isBoostPlatformForPlayer(platform, this.playerNumber)) {
                this.speedBoost = true;
                this.jumpBoost = true;
                this.lastBoostSource = platform;
                if (this.playerNumber === 1) {
                    Resources.Player1GetsBoosted.play();
                } else if (this.playerNumber === 2) {
                    Resources.Player2GetsBoosted.play();
                }
            } else {
                // Land on not-boost platform, check if player needs to discard boost.
                if (
                    this.lastBoostSource && (this.speedBoost || this.jumpBoost)
                ) {
                    this.speedBoost = false;
                    this.jumpBoost = false;
                    this.lastBoostSource = null;
                }
            }
            this._carrierPlatform = platform;
            // Gebruik platform.currentDelta, platform.platformType, etc.
        }
        // Boost on floor
        if (other.owner instanceof Floor && side === Side.Bottom) {
            if (isBoostFloorForPlayer(other.owner, this.playerNumber)) {
                this.speedBoost = true;
                this.jumpBoost = true;
                this.lastBoostSource = other.owner;
                if (this.playerNumber === 1) {
                    Resources.Player1GetsBoosted.play();
                } else if (this.playerNumber === 2) {
                    Resources.Player2GetsBoosted.play();
                }
            } else {
                if (
                    this.lastBoostSource && (this.speedBoost || this.jumpBoost)
                ) {
                    this.speedBoost = false;
                    this.jumpBoost = false;
                    this.lastBoostSource = null;
                }
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
                    other.owner &&
                    isMovingPlatform(other.owner) &&
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
        if (
            other.owner &&
            isMovingPlatform(other.owner)
        ) {
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
        this.scene!.actors.forEach((actor) => {
            if (actor instanceof SpikeBall) {
                actor.kill();
            }
        });

        this.unkill();
        const key = (this.scene as any).levelKey || "level1";
        Resources.gameMusic.stop();
        engine.goToScene(key);
    }

    onPreUpdate(engine: Engine, delta: number) {
        let kb = engine.input.keyboard;

        if (kb.wasPressed(this.controls.reset) && this.scene) {
            // Stop current music
            Resources.gameMusic.stop();
            // Restart current level
            engine.goToScene("level1");
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
                    idleSounds[Math.floor(Math.random() * idleSounds.length)]
                        .play();
                } else if (this.playerNumber === 2) {
                    const idleSounds = [
                        Resources.PlayerIdle4,
                        Resources.PlayerIdle5,
                        Resources.PlayerIdle6,
                    ];
                    idleSounds[Math.floor(Math.random() * idleSounds.length)]
                        .play();
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
            
            // Update cosmetic to walk animation with same flip
            this.children.forEach(child => {
                if (child instanceof Cosmetic) {
                    child.switchCosmeticState(true, this.graphics.flipHorizontal);
                }
            });
        } else {
            // If idle, use idle animation
            if (this.graphics.current !== this.#idleAnimation) {
                this.graphics.use(this.#idleAnimation);
                this.graphics.flipHorizontal = false; // Reset flip when idle
                
                // Update cosmetic to idle animation
                this.children.forEach(child => {
                    if (child instanceof Cosmetic) {
                        child.switchCosmeticState(false, false);
                    }
                });
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
            this._lastEngine.goToScene("level1");
        }
    }

    updateCarrierPlatform() {
        if (this._carrierPlatform) {
            console.log("currentDelta:", this._carrierPlatform.currentDelta);
        }
    }
}
