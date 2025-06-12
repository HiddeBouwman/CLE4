import { Scene } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";


export class LevelOne extends Scene {
    floor: Floor;
    player1: Player;
    player2: Player;

    constructor() {
        super();
    }

    onInitialize(engine) {
        //add players and floor to scene
        this.player1 = new Player(380, 550, 1);
        this.player2 = new Player(300, 550, 2);
        this.add(this.player1);
        this.add(this.player2);

        // Add finish object (adjust x,y position as needed)
        this.add(new Finish(700, 500));

        this.add(new Floor(400, 580, 800, 100));
        this.add(new Floor(200, 200, 100, 100));
    }

    onActivate() {
        console.log("level 1 loaded");
    }
}
