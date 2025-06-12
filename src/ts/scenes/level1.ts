import { Scene } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { CameraController } from "../camera.ts";


export class LevelOne extends Scene {
    floor: Floor;
    player1: Player;
    player2: Player;
    private cameraController: CameraController;
    constructor() {
        super();
    }

    onInitialize(engine) {
        //add players and floor to scene
        this.player1 = new Player(380, 550, 1);
        this.player2 = new Player(300, 550, 2);
        this.add(this.player1);
        this.add(this.player2);


        this.add(new Floor(400, 580, 800, 100));
        this.add(new Floor(200, 200, 100, 100));

        this.cameraController = new CameraController(engine.currentScene, engine.currentScene.camera);
    }

    onPreUpdate(engine, delta) {
    this.cameraController.update(this.player1, this.player2);
}

    onActivate() {
        console.log("level 1 loaded");
    }
}
