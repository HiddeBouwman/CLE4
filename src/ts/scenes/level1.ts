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
import { MovementMode, PlatformType } from "../objects/platform.ts";
import { MovingPlatform } from "../objects/MovingPlatform.ts";
import { Portal } from "../objects/portal.ts";
import { Block } from "../objects/block.ts";

import { Resources } from "../resources.ts";

export class LevelOne extends Scene {
    public levelKey = "level1";
    floor: Floor;
    player1: Player;
    player2: Player;
    private cameraController: CameraController;
    private parallax!: ParallaxBackgroundManager; // Background
    constructor() {
        super();
    }

    onInitialize(engine: Engine) {

        // Finish
        this.add(new Finish(700, 302));
        // Portal
        this.add(new Portal(-300, 301));
        //add players, finish and floor to scene
        this.player1 = new Player(7 * 32, 14 * 32, 1);
        this.player2 = new Player(9 * 32, 14 * 32, 2);
        this.add(this.player1);
        this.add(this.player2);

        // Parameters: x, y, width, height

        // walls
        this.add(new Floor(-34, 0, 12, 30));
        this.add(new Floor(58, 0, 12, 30));

        // floor
        this.add(new Floor(0, 40, 30, 30));
        this.add(new Floor(56, 40, 20, 30, [1, 2])); // the numbers [1, 2] are for boosting. Can either be left out, [1], [2], or [1, 2]

        // ground platforms
        this.add(new Floor(-15, -2, 4, 2));
        this.add(new Floor(8, -2, 6, 2));
        this.add(new Floor(35, -2, 3, 2));
        this.add(new Floor(35, -14, 3, 2));
        this.add(new Block(-300, -250, 5000));
        this.add(new Block(-250, -400, 8000));
        // this.add(new Block(-300, 300, 2000));



        this.add(new Box(192, -648));

        // traps
        const trap1 = new SpikeBallTrap(198, 8);
        this.add(trap1);

        // trap plates
        this.add(new TrapPlate(190, 310, trap1)); // positionX, positionY, trap


        /** 
         * Platforms
         */

        const alwaysPlatform = new MovingPlatform(
            -250, -50, 100, 20, // spawnposX, spawnposY, width (unused), height (unused) 
            PlatformType.PurpleYellowPlatform, // what type of sprite gets rendered, but that doesn't really matter
            186, 60, new Vector(0.5, 0.5), // width, height, offset
            new Vector(-250, -50), // start
            new Vector(-50, -50), // end, this means you can do diagonal movement as well.
            96, // movement speed
            MovementMode.Always, // Movement mode is either [Always], [PressurePlate], or [PressurePlateReturn].
            2000, // Pause for 2 seconds at each end
            [1, 2], // Player 1 and 2 both get a boost on this platform. This is either set to [], [1], [2], or [1, 2].
            new Vector(2, 2) // Makes the sprite have twice the width, and twice the height.
        );
        this.add(alwaysPlatform);



        const platePlatform = new MovingPlatform(
            544, -50, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(544, -50),
            new Vector(928, -50),
            192,
            MovementMode.PressurePlate, // Needs a pressure plate to make it move
            0,
            [],
            new Vector(2, 2)
        );
        this.add(platePlatform);

        // In case it needs a pressure plate to move:
        const plate1 = new DefaultPlate(256, -138, platePlatform);
        this.add(plate1);



        const returnPlatform = new MovingPlatform(
            1344, -48, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(1344, -48),
            new Vector(1344, -384),
            96,
            MovementMode.PressurePlateReturn,
            0, // Gets ignored because of PressurePlateReturn mode
            [],
            new Vector(2, 2)
        );
        this.add(returnPlatform);
        const plate2 = new DefaultPlate(1120, -142, returnPlatform);
        this.add(plate2);
        const plate3 = new DefaultPlate(1120, -526, returnPlatform);
        this.add(plate3);



        this.cameraController = new CameraController(engine.currentScene, engine.currentScene.camera);
        this.parallax = new ParallaxBackgroundManager(this, this.camera, engine); // Camera bepaalt deels hoe de achtergrond zich gedraagd
    }

    onPreUpdate(engine: Engine, delta: number) {
        this.cameraController.update(this.player1, this.player2);
        this.parallax.update();

        
        // --- Death zone check ---
        const deathY = 1000; // Pas deze waarde aan naar wens

        if (this.player1.pos.y > deathY) {
            Resources.PlayerDeathSound1.play();
            engine.goToScene("level1");
        } else if (this.player2.pos.y > deathY) {
            Resources.PlayerDeathSound3.play();
            engine.goToScene("level1");
        }
    }

    onActivate() {
        console.log("level 1 loaded");
        Resources.gameMusic.loop = true;
        Resources.gameMusic.play();

        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            console.log("Pls");
            this.player1.pos = new Vector(-512, 648);
            this.player2.pos = new Vector(-448, 648);
            Resources.finishMSG.stop();

        }
    }
}