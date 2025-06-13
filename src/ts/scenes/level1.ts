import { Engine, Scene } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { Finish } from "../objects/finish.ts";
import { CameraController } from "../camera.ts";
import { Box } from "../objects/box.ts";
import { ParallaxBackgroundManager } from "../objects/parallaxBackgroundManager.ts";


export class LevelOne extends Scene {
    floor: Floor;
    player1: Player;
    player2: Player;
    private cameraController: CameraController;
    private parallax!: ParallaxBackgroundManager; // Achtergrond

    constructor() {
        super();
    }

    onInitialize(engine: Engine) {
        //add players, finish and floor to scene
        this.player1 = new Player(380, 550, 1);
        this.player2 = new Player(300, 550, 2);
        this.add(this.player1);
        this.add(this.player2);

        this.add(new Finish(700, 500));

        this.add(new Box(400, 500));

        this.add(new Floor(400, 1080, 1000, 500));
        this.add(new Floor(200, 200, 100, 100));

        this.cameraController = new CameraController(engine.currentScene, engine.currentScene.camera);
        this.parallax = new ParallaxBackgroundManager(this, this.camera, engine); // Camera bepaalt deels hoe de achtergrond zich gedraagd
    }

    onPreUpdate(engine: Engine, delta: number) {
        this.cameraController.update(this.player1, this.player2);
        this.parallax.update();
    }

    onActivate() {
        console.log("level 1 loaded");
    }
}
