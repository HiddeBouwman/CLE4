import { Scene, Engine, Vector } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { Finish } from "../objects/finish.ts";
import { CameraController } from "../camera.ts";
import { Box } from "../objects/box.ts";
import { PressurePlate } from "../objects/pressurePlate.ts";
import { ParallaxBackgroundManager } from "../objects/parallaxBackgroundManager.ts";
import { ElevatorPlatform } from "../objects/elevatorPlatform.ts";
import { Platform } from "../objects/platform.ts";
import { Portal } from "../objects/portal.ts";

export class LevelOne extends Scene {
    floor: Floor;
    player1: Player;
    player2: Player;
    private cameraController: CameraController;
    private parallax!: ParallaxBackgroundManager; // Background
    constructor() {
        super();
    }

    onInitialize(engine: Engine) {
        //add players, finish and floor to scene
        this.player1 = new Player(7 * 32, 14 * 32, 1);
        this.player2 = new Player(9 * 32, 14 * 32, 2);
        this.add(this.player1);
        this.add(this.player2);

        // Parameters: x, y, width, height
        // walls
        this.add(new Floor(-28, 0, 5, 30));
        this.add(new Floor(28, 0, 5, 30));
        // floor
        this.add(new Floor(0, 40, 30, 30));
        // platforms
        this.add(new Floor(2, 6, 4, 2));
        this.add(new Floor(7, 1, 4, 2));

        // Finish
        this.add(new Finish(700, 308));
        // Portal
        this.add(new Portal(-300, 280));

        this.add(new Box(500, 500));

        const coloredPlatform1 = new Platform(-200, 100, 100, 20, 1,
            180, 30, new Vector(0.5, -2)); // wit voor speler 1
        const coloredPlatform2 = new Platform(-400, 100, 100, 20, 2,
            180, 30, new Vector(0.5, -2)); // zwart voor speler 2

        this.add(coloredPlatform1);
        this.add(coloredPlatform2);

        const movingPlatform = new ElevatorPlatform(500, 100, 100, 20, 1,
            180, 30, new Vector(0.5, -2), -100);
        this.add(movingPlatform);

        this.add(new PressurePlate(600, 306, movingPlatform));

        this.cameraController = new CameraController(engine.currentScene, engine.currentScene.camera);
        this.parallax = new ParallaxBackgroundManager(this, this.camera, engine); // Camera bepaalt deels hoe de achtergrond zich gedraagd
    }

    onPreUpdate(engine: Engine, delta: number) {
        this.cameraController.update(this.player1, this.player2);
        this.parallax.update();
    }

    onActivate() {
        console.log("level 1 loaded");

        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            console.log("Pls");
            this.player1.pos = new Vector(210, 550);
            this.player2.pos = new Vector(270, 550);
        }
    }
}
