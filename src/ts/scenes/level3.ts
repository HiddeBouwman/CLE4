import { Scene, Engine, Vector } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { Finish } from "../objects/finish.ts";
import { CameraController } from "../camera.ts";
import { Box } from "../objects/box.ts";
import { SpikeBallTrap } from "../objects/spikeBallTrap.ts";
import { TrapPlate } from "../objects/trapPlate.ts";
import { DefaultPlate } from "../objects/defaultPlate.ts";
import { ParallaxBackgroundManager } from "../objects/parallaxBackgroundManager.ts";
import { ElevatorPlatform } from "../objects/elevatorPlatform.ts";
import { Platform, PlatformType, MovementMode } from "../objects/platform.ts";
import { Portal } from "../objects/portal.ts";
import { Resources } from "../resources.ts";
import { MovingPlatform } from "../objects/MovingPlatform.ts";

export class LevelThree extends Scene {
    public levelKey = "level3";
    floor: Floor;
    player1: Player;
    player2: Player;
    private cameraController: CameraController;
    private parallax!: ParallaxBackgroundManager; // Background
    constructor() {
        super();
    }

    onInitialize(engine: Engine) {

        Resources.Menu.stop();

        this.player1 = new Player(7 * 32, 14 * 32, 1);
        this.player2 = new Player(9 * 32, 14 * 32, 2);
        this.add(this.player1);
        this.add(this.player2);

        // Parameters: x, y, width, height

        // walls
        this.add(new Floor(-34, 0, 12, 30));
        this.add(new Floor(101, 0, 12, 30));

        // floor
        this.add(new Floor(0, 40, 100, 30));
        // this.add(new Floor(56, 40, 20, 30, [1, 2])); // the numbers [1, 2] are for boosting. Can either be left out, [1], [2], or [1, 2]

        //higher floors
        this.add(new Floor(5, 36, 5, 30));
        this.add(new Floor(30, 36, 5, 30));
        this.add(new Floor(50, 27, 5, 30));
        this.add(new Floor(58, 1, 5, 4));
        this.add(new Floor(70, 5, 10, 3));
        this.add(new Floor(82, 1, 5, 4));

        //special platforms
        const alwaysPlatform = new MovingPlatform(
            160, 100, 100, 20, // spawnposX, spawnposY, width (unused), height (unused) 
            PlatformType.PurpleYellowPlatform, // what type of sprite gets rendered, but that doesn't really matter
            186, 30, new Vector(0.5, 0.5), // width, height, offset
            new Vector(160, 100), // start
            new Vector(950, 100), // end, this means you can do diagonal movement as well.
            96, // movement speed
            MovementMode.Always, // Movement mode is either [Always], [PressurePlate], or [PressurePlateReturn].
            2000, // Pause for 2 seconds at each end
            [1, 2], // Player 1 and 2 both get a boost on this platform. This is either set to [], [1], [2], or [1, 2].
            new Vector(2, 2) // Makes the sprite have twice the width, and twice the height.
        );
        this.add(alwaysPlatform);


        const platePlatform = new MovingPlatform(
            1250, 200, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(1250, 300),
            new Vector(1250, -200),
            192,
            MovementMode.PressurePlate, // Needs a pressure plate to make it move
            0,
            [],
            new Vector(2, 2)
        );
        this.add(platePlatform);

        // In case it needs a pressure plate to move:
        const plate1 = new DefaultPlate(960, 180, platePlatform); // positionX, positionY, name platform.
        const plate2 = new DefaultPlate(1550, -100, platePlatform); // positionX, positionY, name platform.
        this.add(plate1);
        this.add(plate2)

        // // ground platforms
        // this.add(new Floor(-15, -2, 4, 2));
        // this.add(new Floor(8, -2, 6, 2));
        // this.add(new Floor(35, -2, 3, 2));
        // this.add(new Floor(35, -14, 3, 2));

        //box
        this.add(new Box(-150, 0));
        this.add(new Box(1600, 20));

        this.cameraController = new CameraController(engine.currentScene, engine.currentScene.camera);
        this.parallax = new ParallaxBackgroundManager(this, this.camera, engine); // Camera bepaalt deels hoe de achtergrond zich gedraagd
    }

    onPreUpdate(engine: Engine, delta: number) {
        this.cameraController.update(this.player1, this.player2);
        this.parallax.update();
        // --- Death zone check ---
        const deathY = 1000; // Pas deze waarde aan naar wens

        if (this.player1.pos.y > deathY) {
            Resources.deathSound1.play();
            engine.goToScene("level1");
        } else if (this.player2.pos.y > deathY) {
            Resources.deathSound2.play();
            engine.goToScene("level1");
        }
    }

    onActivate() {
        console.log("level 3 loaded");

        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            console.log("Pls");
            this.player1.pos = new Vector(-512, 648);
            this.player2.pos = new Vector(-448, 648);
        }
    }
}