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

        this.floor = new Floor(400, 580);
        this.add(this.floor);
    }

    onActivate() {
        console.log("level 1 loaded");
    }
}
