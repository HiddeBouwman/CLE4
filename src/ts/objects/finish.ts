import { Actor, Vector, CollisionType, Keys } from "excalibur";
import { Player } from "../player.ts";
import { Resources } from "../resources.ts";

// Import Controls.
type PlayerControls = {
    left: Keys;
    right: Keys;
    up: Keys;
    down: Keys;
};

// Import Controls from Player class.
import { Controls } from "../player.ts";

export class Finish extends Actor {
    private player1Present: boolean = false;
    private player2Present: boolean = false;

    constructor(x: number, y: number) {
        super({ width: 100, height: 100, collisionType: CollisionType.Active })
        
        this.scale = new Vector(0.5, 0.5)
        this.pos = new Vector(x, y)
        
        this.graphics.use(Resources.Finish.toSprite());
    }

    onInitialize(engine) {
        this.on('collisionstart', (event) => this.hitSomething(event))
        this.on('collisionend', (event) => this.playerLeaves(event))
    }


    // Specifics for later, this is enough for now..
    hitSomething(event) {
        if (event.other.owner instanceof Player && this.scene) {
            const player = event.other.owner as Player;
            
            // Tracks players colliding into finish object.
            player.controls === Controls.player1 
                ? (this.player1Present = true, console.log("Player 1 reached finish"))
                : (this.player2Present = true, console.log("Player 2 reached finish"));

            // Switch scene if both are present.
            if (this.player1Present && this.player2Present) {
                console.log("Both players at finish - switching scene!");
                this.scene.engine.goToScene('menu');
            }
        }
    }

    // Checks if player leaves.
    playerLeaves(event) {
        if (event.other.owner instanceof Player) {
            const player = event.other.owner as Player;
            
            // 
            player.controls === Controls.player1
                ? (this.player1Present = false, console.log("Player 1 left finish"))
                : (this.player2Present = false, console.log("Player 2 left finish"));
        }
    }
}