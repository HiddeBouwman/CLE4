import { Scene, Vector } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { Finish } from "../objects/finish.ts";
import { CameraController } from "../camera.ts";
import { Box } from "../objects/box.ts";



export class LevelOne extends Scene {
    floor: Floor;
    player1: Player;
    player2: Player;
    private cameraController: CameraController;

    constructor() {
        super();
    }

    onInitialize(engine) {
        this.player1 = new Player(7 * 32, 14 * 32, 1);
        this.player2 = new Player(9 * 32, 14 * 32, 2);

        this.add(this.player1);
        this.add(this.player2);

        // Parameters: x, y, width, height
        this.add(new Floor(0, 40, 30, 30));
        this.add(new Floor(2, 5, 4, 2));

        this.add(new Finish(700, 500));

        this.add(new Box(550, 500));

        this.cameraController = new CameraController(
            engine.currentScene,
            engine.currentScene.camera,
        );
    }

    onPreUpdate(engine, delta) {
        this.cameraController.update(this.player1, this.player2);
    }

    onActivate() {
        console.log("level 1 loaded");

        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            console.log("Pls");
            this.player1.pos = new Vector(380, 550);
            this.player2.pos = new Vector(300, 550);
        }
    }
}
