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
import { PlatformType } from "../objects/platform.ts"; 
import { TwoPlatePlatform } from "../objects/twoPlatePlatform.ts";
import { Portal } from "../objects/portal.ts";
import { Block } from "../objects/block.ts";
import { AlwaysMovingPlatform } from "../objects/AlwaysMovingPlatform.ts";

import { PressurePlatePlatform } from "../objects/PressurePlatePlatform.ts";
import { PressurePlateReturnPlatform } from "../objects/PressurePlateReturnPlatform.ts";

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



        const box1 = new Box(192, -648);
        this.add(box1);;
        const box2 = new Box(1100, -142);
        this.add(box2);;

        // traps
        const trap1 = new SpikeBallTrap(198, 8);
        this.add(trap1);

        // trap plates
        this.add(new TrapPlate(190, 310, trap1)); // positionX, positionY, trap


        /** 
         * Platforms
         */

        const alwaysPlatform = new AlwaysMovingPlatform(
            -250, -50, 100, 20,
            PlatformType.PurpleYellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-250, -50),
            new Vector(-50, -50),
            96,
            2000,
            [1, 2],
            new Vector(2, 2)
        );
        this.add(alwaysPlatform);



        const platePlatform = new TwoPlatePlatform(
            544, -50, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(544, -50),
            new Vector(928, -50),
            192, // speed
            0, // pauseDuration
            [], // boostForPlayers
            new Vector(2, 2)
        );
        this.add(platePlatform);

        // In case it needs a pressure plate to move:
        const plate1 = new DefaultPlate(256, -138, platePlatform, box1);
        this.add(plate1);
        const plate = new DefaultPlate(330, -130, platePlatform, box1); // positionX, positionY, name platform.
        this.add(plate);



        const returnPlatform = new PressurePlateReturnPlatform(
            1344, -48, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(1344, -48),
            new Vector(1344, -384),
            96,
            [],
            new Vector(2, 2)
        );
        this.add(returnPlatform);
        const plate2 = new DefaultPlate(1120, -142, returnPlatform, box2);
        this.add(plate2);
        const plate3 = new DefaultPlate(1120, -526, returnPlatform, box2);
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
        Resources.gameMusic.volume = 0.3;

        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            console.log("Pls");
            this.player1.pos = new Vector(-512, 648);
            this.player2.pos = new Vector(-448, 648);
            Resources.finishMSG.stop();

        }
    }
}