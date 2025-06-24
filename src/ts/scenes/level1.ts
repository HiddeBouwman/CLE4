import { Scene, Engine, Vector } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { Finish } from "../objects/finish.ts";
import { CameraController } from "../camera.ts";
import { Box } from "../objects/box.ts";
import { DefaultPlate } from "../objects/defaultplate.ts";
import { ParallaxBackgroundManager } from "../objects/parallaxBackgroundManager.ts";
import { PlatformType } from "../objects/platform.ts";
import { TwoPlatePlatform } from "../objects/twoPlatePlatform.ts";
import { PressurePlatePlatform } from "../objects/PressurePlatePlatform.ts";
import { PressurePlateReturnPlatform } from "../objects/PressurePlateReturnPlatform.ts";
import { PressurePlate } from "../objects/pressureplate.ts";

import { Resources, stopAllMusic } from "../resources.ts";
import { Fire } from "../objects/fire.ts";
import { FireWall } from "../objects/fireWall";

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
        //add players, finish and floor to scene
        this.player1 = new Player(7 * 32, 0, 1);
        this.player2 = new Player(9 * 32, 0, 2);
        this.add(this.player1);
        this.add(this.player2);

        // Parameters: x, y, width, height

        // walls
        this.add(new Floor(-34, 0, 12, 30));
        this.add(new Floor(34, 0, 12, 30));

        // floor
        this.add(new Floor(0, 35, 46, 10));

        // middle layers
        this.add(new Floor(0, -15, 10, 5));
        this.add(new Floor(0, 23, 10, 6.2));
        this.add(new Floor(0, 5, 10, 4.2));

        //roof
        this.add(new Floor(0, -35, 46, 10));



        //boxes
        const box1 = new Box(-3, 15);
        this.add(box1);
        const box2 = new Box(-3, 3);
        this.add(box2);


        // static platforms
        const doublePlatePlatform3 = new TwoPlatePlatform(
            -12, 25, 100, 20,
            PlatformType.YellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(18, 20),
            new Vector(18, -20),
            0, // speed
            0, // pauseDuration
            [2], // boostForPlayers
            new Vector(2, 2),
            2 // requires two plates (can be set to more than 2 plates)
        );
        this.add(doublePlatePlatform3);


        //double pressure plate platforms
        const doublePlatePlatform1 = new TwoPlatePlatform(
            -12, 23.5, 100, 20,
            PlatformType.PurplePlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-12, 22),
            new Vector(-12, -12),
            192, // speed
            0, // pauseDuration
            [1], // boostForPlayers
            new Vector(2, 2),
            2 // requires two plates (can be set to more than 2 plates)
        );
        this.add(doublePlatePlatform1);


        const doublePlatePlatform2 = new TwoPlatePlatform(
            18, 20, 100, 20,
            PlatformType.YellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(18, 20),
            new Vector(18, -20),
            192, // speed
            0, // pauseDuration
            [2], // boostForPlayers
            new Vector(2, 2),
            2 // requires two plates (can be set to more than 2 plates)
        );
        this.add(doublePlatePlatform2);



        //pressure plates
        const doubleplate1 = new DefaultPlate(-660, 792, 0, doublePlatePlatform1);
        this.add(doubleplate1);
        const doubleplate2 = new DefaultPlate(100, 533, 0, doublePlatePlatform1, box1);
        this.add(doubleplate2);

        const doubleplate3 = new DefaultPlate(100, 19, 0, doublePlatePlatform2, box2);
        this.add(doubleplate3);
        const doubleplate4 = new DefaultPlate(100, -645, 0, doublePlatePlatform2);
        this.add(doubleplate4);

        //hazards
        this.add(new FireWall(10, 25.3, 23, 25.3));

        // Finish
        this.add(new Finish(-3, 15));






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
        // this doesnt work for some reaason.
        Resources.gameMusic.loop = true;
        Resources.gameMusic.play();
        Resources.gameMusic.volume = 0.1;
        stopAllMusic();




        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            this.player1.pos = new Vector(-600, 700);
            this.player2.pos = new Vector(-500, 700);
            Resources.finishMSG.stop();
        }
    }
}