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
import { PortalExit } from "../objects/portalExit.ts";

export class BackwardsLevel extends Scene {
    public levelKey = "backwardslevel";
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

        const purplePlatform2 = new PressurePlateReturnPlatform(
            -6, -5, 100, 20,
            PlatformType.PurplePlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-6, -5),
            new Vector(-1, -5),
            192,
            [1],
            new Vector(2, 2)
        )
        this.add(purplePlatform2);
        const purplePlate2 = new DefaultPlate(-3 * 32, -7 * 32, 0, purplePlatform2);
        this.add(purplePlate2);

        const yellowPlatform2 = new PressurePlateReturnPlatform(
            -26, -8, 100, 20,
            PlatformType.YellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-26, -8),
            new Vector(-42, -8),
            448,
            [2],
            new Vector(2, 2)
        )
        this.add(yellowPlatform2);

        const defaultPlatform1 = new PressurePlateReturnPlatform(
            -28, 1, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-30, 1),
            new Vector(-37, 1),
            192,
            [],
            new Vector(2, 2)
        )
        this.add(defaultPlatform1);

        const purplePlatform3 = new PressurePlateReturnPlatform(
            -42, -8, 100, 20,
            PlatformType.PurplePlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-42, -8),
            new Vector(-42, -1),
            192,
            [1],
            new Vector(2, 2)
        )
        this.add(purplePlatform3);

        const multiPlate1 = new DefaultPlate(-35 * 32, -10 * 32, 0, [yellowPlatform2, defaultPlatform1, purplePlatform3]);
        this.add(multiPlate1);


        // Boxes
        this.add(new Box(-13, -15))

        // Timer blocks

        // Portals
        const portalExitCoords = new Vector(-1 * 32, -6 * 32);
        this.add(new Portal(5, -2.5, portalExitCoords));
        this.add(new PortalExit(portalExitCoords.x, portalExitCoords.y - 48));

        // Finish
        //this.add(new Finish(700, 302));

        // floor
        // this.add(new Floor(56, 40, 20, 30, [1, 2])); // the numbers [1, 2] are for boosting. Can either be left out, [1], [2], or [1, 2]

        //this.add(new Block(-300, -250, 5000));
        //this.add(new Block(-250, -400, 8000));


        // Stage hazards
        //this.add(new Fire(-24, -5));
        this.add(new FireWall(-3.5, 7.4, -8.5, 7.4, "up"));
        this.add(new FireWall(-13, -4.6, -21, -4.6, "up"));
        this.add(new FireWall(-31.5, -19.6, -32.5, -19.6, "up"));
        this.add(new FireWall(-33.5, -9.6, -33.5, -18.6, "left"));
        this.add(new FireWall(-27.5, 1.4, -32.5, 1.4, "up"));
        this.add(new FireWall(-33.5, -1.6, -34.5, -1.6, "up"));
        this.add(new FireWall(-35.5, 1.4, -44.5, 1.4, "up"));
        
        //add players, finish and floor to scene
        this.player1 = new Player(0 * 32, 0 * 32, 1);
        this.player2 = new Player(0 * 32, 0 * 32, 2);
        this.add(this.player1);
        this.add(this.player2);

        // Floors
        this.add(new Floor(0, 2, 4, 2))
        this.add(new Floor(-0.5, -5, 4.5, 2))
        this.add(new Floor(-10.5, -5, 3.5, 2))
        this.add(new Floor(4, 0, 4, 2))
        this.add(new Floor(0, 8, 4, 3))
        this.add(new Floor(-10, 7, 2, 7))
        this.add(new Floor(2, 16, 14, 9))
        this.add(new Floor(-1, -12, 4, 2))
        this.add(new Floor(-8, -13, 2, 4))
        this.add(new Floor(-11, -13, 5, 2))
        this.add(new Floor(-22, -3, 2, 7))
        this.add(new Floor(-17, 15, 7, 20))
        this.add(new Floor(-31, -11, 3, 5))
        this.add(new Floor(-35, -8, 5, 2))
        this.add(new Floor(-23, -16, 5, 3))
        this.add(new Floor(-29, -7, 3, 2))
        this.add(new Floor(-24, 2, 2, 6))
        this.add(new Floor(-26, 2, 2, 4))
        this.add(new Floor(-35, 11, 13, 10))


        // Ceiling
        this.add(new Floor(10, -20, 10, 17))
        this.add(new Floor(-8, -25, 12, 6))
        this.add(new Floor(-25, -32, 12, 6))
        this.add(new Floor(-17, -24, 7, 8))


        // Walls
        this.add(new Floor(2, -12, 2, 16))
        this.add(new Floor(16, -5, 8, 20))
        this.add(new Floor(-12, 4, 2, 14))
        this.add(new Floor(-32, -13, 2, 7))
        this.add(new Floor(-34, 5, 2, 7))


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

            this.player1.pos = new Vector(-1024, -384);
            this.player2.pos = new Vector(-1120, -416);
            Resources.finishMSG.stop();
        }
    }
}