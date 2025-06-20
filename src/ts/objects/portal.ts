import { Actor, Vector, CollisionType, SpriteSheet, Animation, AnimationStrategy } from "excalibur";
import { Player } from "../player.ts";
import { Resources } from "../resources.ts";
import { CollisionGroup } from "../collision.ts";

// Import Controls from Player class.
import { Controls } from "../player.ts";

export class Portal extends Actor {
    private player1Present: boolean = false;
    private player2Present: boolean = false;
    public coordinates: Vector;
    constructor(x: number, y: number, coordinates: Vector) {
        super({ 
            width: 2, 
            height: 10, 
            collisionType: CollisionType.Active,
            // Uses the same stuff as Finish functionality, maybe will change later once it gets more complex.
            collisionGroup: CollisionGroup.Finish
        })
        
        this.scale = new Vector(0.7, 0.7)
        this.pos = new Vector(x * 32, y * 32);
        this.body.useGravity = false 
        this.coordinates = coordinates;
        const portalSpritesheet = SpriteSheet.fromImageSource({
            image: Resources.Portal,
            grid: {
            rows: 24,
            columns: 1,
            spriteWidth: 48,
            spriteHeight: 48
            }
        });
        
        const animatedPortal = Animation.fromSpriteSheet(
            portalSpritesheet,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            120 // Duration per frame in milliseconds
        );
        
        // Loop the animation
        animatedPortal.strategy = AnimationStrategy.Loop;
        
        // Use the animation
        this.graphics.use(animatedPortal);
        this.scale = new Vector(2, 2)

    }

    onInitialize(engine) {
        this.on('collisionstart', (event) => this.hitSomething(event))
    }

    // Handle teleportation.
    hitSomething(event) {
        if (event.other.owner instanceof Player && this.scene) {
            const player = event.other.owner as Player;
            
            player.pos = this.coordinates; // Teleport to the coordinates given.
            
            // Debugging.
            console.log(`${player.playerNumber === 1 ? "Player 1" : "Player 2"} teleported!`);
            if (Math.random() < 0.5) {
                Resources.Teleport.play();
            } else {
                Resources.Teleport2.play();
            }

        }
    }
}