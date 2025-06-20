import { Scene, Engine, Vector } from "excalibur";
import { Player } from "../player.ts";
import { Floor } from "../floor.ts";
import { Finish } from "../objects/finish.ts";
import { CameraController } from "../camera.ts";
import { Box } from "../objects/box.ts";
import { SpikeBallTrap } from "../objects/spikeBallTrap.ts";
import { TrapPlate } from "../objects/trapPlate.ts";
import { DefaultPlate } from "../objects/defaultplate.ts";
import { ParallaxBackgroundManager } from "../objects/parallaxBackgroundManager.ts";
import { ElevatorPlatform } from "../objects/elevatorPlatform.ts";
import { Platform, PlatformType } from "../objects/platform.ts";
import { Portal } from "../objects/portal.ts";
import { Resources } from "../resources.ts";
import { AlwaysMovingPlatform } from "../objects/AlwaysMovingPlatform.ts";
import { PressurePlatePlatform } from "../objects/PressurePlatePlatform.ts";
import { JumpPlate } from "../objects/jumpPlate.ts";

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
        // Standard Coordinates
        this.player1 = new Player(7 * 32, 14 * 32, 1);
        this.player2 = new Player(9 * 32, 14 * 32, 2);
        this.add(this.player1);
        this.add(this.player2);

        

        // Parameters: x, y, width, height


        // Spike Ball Trap
        const trap1 = new SpikeBallTrap(700, -100);
        const trap2 = new SpikeBallTrap(450, -100);
        this.add(trap1);
        this.add(trap2);

        // Trap Plates
        this.add(new TrapPlate(700, 310, 0, trap1));
        this.add(new TrapPlate(800, 310, 0, trap1));
        this.add(new TrapPlate(400, 310, 0, trap2));
        this.add(new TrapPlate(500, 310, 0, trap2));

        // walls
        this.add(new Floor(-34, 0, 12, 60));
        this.add(new Floor(101, 0, 12, 60));

        // floor
        this.add(new Floor(0, 40, 100, 30));
        this.add(new Floor(0, -20, 100, 5));
        this.add(new Floor(19.5, -39, 5, 9));

        //floor for 3rd floor
        //2nd floor ceiling
        this.add(new Floor(-4, -43, 20, 5));
        
        // this.add(new Floor(56, 40, 20, 30, [1, 2])); // the numbers [1, 2] are for boosting. Can either be left out, [1], [2], or [1, 2]

        //higher floors
        this.add(new Floor(5, 36, 5, 30));
        this.add(new Floor(30, 36, 5, 30));
        this.add(new Floor(50, 27, 5, 30));
        this.add(new Floor(58, 1, 5, 4));
        this.add(new Floor(70, 5, 10, 3));
        this.add(new Floor(82, 1, 5, 4));

        //higher floors (2nd floor)
        this.add(new Floor(5, -25, 5, 10));
        this.add(new Floor(43, -25, 10, 10));

        //special platforms
        const alwaysPlatform = new AlwaysMovingPlatform(
            160, 100, 100, 20, // spawnposX, spawnposY, width (unused), height (unused) 
            PlatformType.PurpleYellowPlatform, // what type of sprite gets rendered, but that doesn't really matter
            186, 30, new Vector(0.5, 0.5), // width, height, offset
            new Vector(160, 100), // start
            new Vector(950, 100), // end, this means you can do diagonal movement as well.
            96, // movement speed
            2000, // Pause for 2 seconds at each end
            [1, 2], // Player 1 and 2 both get a boost on this platform. This is either set to [], [1], [2], or [1, 2].
            new Vector(2, 2) // Makes the sprite have twice the width, and twice the height.
        );
        this.add(alwaysPlatform);


        const plateDoublePlatform = new PressurePlatePlatform(
            40, 5, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(40, 5),
            new Vector(40, -5),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        this.add(plateDoublePlatform);

        const pressurePlatePlatform = new PressurePlatePlatform(
            30, -25, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(5, -25),
            new Vector(5, -25),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        this.add(pressurePlatePlatform);
        const boxForPressurePlate = new Box(-3, 0);

        const pressurePlatePlatform2ndFloor = new PressurePlatePlatform(
            5, 4, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(5, 4),
            new Vector(25, 4),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        this.add(pressurePlatePlatform2ndFloor);



        const platformPlate = new DefaultPlate(0, 320, 0, pressurePlatePlatform, boxForPressurePlate);

        this.add(platformPlate);
        this.add(boxForPressurePlate)

        // In case it needs a pressure plate to move:
        // You need to pass a Box as the fourth argument. Replace 'null' with the actual Box if needed.
        const boxForPlate1 = new Box(970, 180);
        const boxForPlate2 = new Box(1560, -100);
        this.add(boxForPlate1);
        this.add(boxForPlate2);
        const plate1 = new DefaultPlate(960, 180, 0, plateDoublePlatform, boxForPlate1); // positionX, positionY, platform, targetBox
        const plate2 = new DefaultPlate(1550, -100, 0, plateDoublePlatform, boxForPlate2); // positionX, positionY, platform, targetBox
        this.add(plate1);
        this.add(plate2);


          //jump plate test
        const jumpPlate = new JumpPlate(-80, -800, 900);
        this.add(jumpPlate);



        // // ground platforms
        // this.add(new Floor(-15, -2, 4, 2));
        // this.add(new Floor(8, -2, 6, 2));
        // this.add(new Floor(35, -2, 3, 2));
        // this.add(new Floor(35, -14, 3, 2));

        //box
        //this.add(new Box(-3, 0));
        this.add(new Box(70, -15));

        //teleporter
        this.add(new Portal(57, 9.5, new Vector(-480, -1000)));
        this.add(new Portal(-8, 9.5, new Vector(-480, -1000)));

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
            engine.goToScene("level3");
        } else if (this.player2.pos.y > deathY) {
            Resources.PlayerDeathSound3.play();
            engine.goToScene("level3");
        }
    }

    onActivate() {
        console.log("level 3 loaded");

        // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            this.player1.pos = new Vector(-512, 648);
            this.player2.pos = new Vector(-448, 648);
        }
    }
}