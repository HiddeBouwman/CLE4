import { Scene, Engine, Vector } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { Finish } from "../objects/finish.ts";
import { CameraController } from "../camera.ts";
import { DefaultPlate } from "../objects/defaultplate.ts";
import { ParallaxBackgroundManager } from "../objects/parallaxBackgroundManager.ts";
import { Resources } from "../resources.ts";

// stage specific
import { Box } from "../objects/box.ts";
import { Fire } from "../objects/fire.ts";
import { FireWall } from "../objects/fireWall";
import { PlatformType } from "../objects/platform.ts";
import { AlwaysMovingPlatform } from "../objects/AlwaysMovingPlatform.ts";
import { PressurePlatePlatform } from "../objects/PressurePlatePlatform.ts";
import { PressurePlateReturnPlatform } from "../objects/PressurePlateReturnPlatform.ts";
import { TwoPlatePlatform } from "../objects/twoPlatePlatform.ts";
import { Block } from "../objects/block.ts"; 
import { Portal } from "../objects/portal.ts";

export class BackwardsLevel extends Scene {
    public levelKey = "backwarslevel";
    floor: Floor;
    player1: Player;
    player2: Player;
    private cameraController: CameraController;
    private parallax!: ParallaxBackgroundManager; // Background
    constructor() {
        super();
    }

    onInitialize(engine: Engine) {
        // Platforms
        const purplePlatform1 = new PressurePlateReturnPlatform(
            -6, 2, 100, 20,
            PlatformType.PurplePlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-6, 2),
            new Vector (-6, 6),
            48,
            [1],
            new Vector(2, 2)
        )
        this.add(purplePlatform1);
        const purplePlate1 = new DefaultPlate(-10 * 32, 0 * 32, 0, purplePlatform1);
        this.add(purplePlate1);

        const yellowPlatform1 = new PressurePlatePlatform(
            6, 7, 100, 20,
            PlatformType.YellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(6, 7),
            new Vector(6, 7),
            48,
            0,
            [2],
            new Vector(2, 2)
        )
        this.add(yellowPlatform1);

        // Stage hazards
        //this.add(new Fire(-24, -5));
        this.add(new FireWall(-3.5, 7.6, -8.5, 7.6));

        // Timer blocks

        // Portals
        this.add(new Portal(4, -2.5, new Vector(-1 * 32, -5 * 32)));

        // Finish
        //this.add(new Finish(700, 302));

        // floor
        this.add(new Floor(56, 40, 20, 30, [1, 2])); // the numbers [1, 2] are for boosting. Can either be left out, [1], [2], or [1, 2]

        //this.add(new Block(-300, -250, 5000));
        //this.add(new Block(-250, -400, 8000));

        //add players, finish and floor to scene
        this.player1 = new Player(0 * 32, 0 * 32, 1);
        this.player2 = new Player(0 * 32, 0 * 32, 2);
        this.add(this.player1);
        this.add(this.player2);

        // Walls
        // Section 1
        this.add(new Floor(2, -12, 2, 16))
        this.add(new Floor(16, -5, 8, 20))

        // Floors
        // Section 1
        this.add(new Floor(0, 2, 4, 2))
        this.add(new Floor(0, -5, 4, 2))
        this.add(new Floor(3, 0, 3, 2))
        this.add(new Floor(0, 8, 4, 3))
        this.add(new Floor(-10, 7, 2, 7))
        this.add(new Floor(2, 16, 14, 9))

        // Ceiling
        // Section 1
        this.add(new Floor(10, -10, 10, 7))


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
            engine.goToScene("backwardslevel");
        } else if (this.player2.pos.y > deathY) {
            Resources.PlayerDeathSound3.play();
            engine.goToScene("backwardslevel");
        }
    }

    onActivate() {
        console.log("level ? loaded");
        Resources.gameMusic.loop = true;
        Resources.gameMusic.play();
        Resources.gameMusic.volume = 0.3;

        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            // Nieuwe spawnposities
            this.player1.setSpawn(-32, 0);
            this.player2.setSpawn(0, 0);

            this.player1.pos = new Vector(-32, 0);
            this.player2.pos = new Vector(0, 0);
            Resources.finishMSG.stop();
        }
    }
}