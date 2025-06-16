import { Actor, Vector, CollisionType, Resource } from "excalibur";
import { Player } from "../player.ts";
import { Resources } from "../resources.ts";
import { CollisionGroup } from "../collision.ts";

// Import Controls from Player class.
import { Controls } from "../player.ts";

export class Portal extends Actor {
    private player1Present: boolean = false;
    private player2Present: boolean = false;
    
    constructor(x: number, y: number) {
        super({ 
            width: 100, 
            height: 100, 
            collisionType: CollisionType.Active,
            // Uses the same stuff as Finish functionality, maybe will change later once it gets more complex.
            collisionGroup: CollisionGroup.Finish
        })
        
        this.scale = new Vector(0.7, 0.7)
        this.pos = new Vector(x, y)
        this.body.useGravity = false 
        this.graphics.use(Resources.Portal.toSprite());

    }

    onInitialize(engine) {
        this.on('collisionstart', (event) => this.hitSomething(event))
    }

    // Handle teleportation.
    hitSomething(event) {
        if (event.other.owner instanceof Player && this.scene) {
            const player = event.other.owner as Player;
            
            // Teleport the player to a new position.
            const teleportPos = new Vector(500, 100);
            player.pos = teleportPos;
            
            // Debugging.
            console.log(`${player.playerNumber === 1 ? "Player 1" : "Player 2"} teleported!`);
            Resources.Teleport.play();

        }
    }
}