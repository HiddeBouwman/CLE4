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
import { Resources, stopAllMusic } from "../resources.ts";
import { AlwaysMovingPlatform } from "../objects/AlwaysMovingPlatform.ts";
import { PressurePlatePlatform } from "../objects/PressurePlatePlatform.ts";
import { JumpPlate } from "../objects/jumpPlate.ts";
import { FireWall } from "../objects/fireWall.ts";

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

    onInitialize(engine: Engine) {        // Standard Coordinates
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
        this.add(new Floor(-41, -70, 5, 20));

        // floor
        this.add(new Floor(0, 40, 100, 30));
        this.add(new Floor(0, -20, 100, 5));
        this.add(new Floor(19.5, -39, 5, 9));

        //floor for 3rd floor
        this.add(new Floor(45, -48, 20, 4));
        
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
        this.add(new Floor(76, -25, 5, 10));
        this.add(new Floor(79, -25, 5, 6));
        this.add(new Floor(90, -30, 5, 15));
        this.add(new Floor(76, -45, 5, 3));
        this.add(new Floor(68, -50, 5, 8));

        //higher floors (3rd floor)
        this.add(new Floor(52, -63, 9, 8));
        this.add(new Floor(31, -55, 6, 7));
        this.add(new Floor(22, -52, 5, 5));
        this.add(new Floor(8, -52, 5, 5));
        this.add(new Floor(-6, -52, 5, 5));
        this.add(new Floor(-20, -52, 5, 5));
        this.add(new Floor(-27, -67, 5, 3));

        //special platforms
        

        //3rd floor
        const alwaysMovingPlatform = new AlwaysMovingPlatform(
            40, -52, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(40, -52),
            new Vector(40, -63),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        const alwaysMovingPlatformTwo = new AlwaysMovingPlatform(
            -14, -68, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-17, -68),
            new Vector(-5, -68),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        const alwaysMovingPlatformThree = new AlwaysMovingPlatform(
            1, -68, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(1, -65),
            new Vector(1, -75),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        const alwaysMovingPlatformFour = new AlwaysMovingPlatform(
            5, -70, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(5, -70),
            new Vector(35, -70),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        this.add(alwaysMovingPlatformFour);
        this.add(alwaysMovingPlatformThree);
        this.add(alwaysMovingPlatformTwo);
        this.add(alwaysMovingPlatform);

        const colorPlatformOne = new PressurePlatePlatform(
            15, -55.5, 100, 20,
            PlatformType.YellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(15, -53),
            new Vector(15, -53),
            192,
            0,
            [2],
            new Vector(2, 2)
        );
        const colorPlatformTwo = new PressurePlatePlatform(
            1, -55.5, 100, 20,
            PlatformType.PurplePlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(0, -53),
            new Vector(0, -53),
            192,
            0,
            [1],
            new Vector(2, 2)
        );
        const colorPlatformThree = new PressurePlatePlatform(
            -13, -55.5, 100, 20,
            PlatformType.YellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(-13, -53),
            new Vector(-13, -53),
            192,
            0,
            [2],
            new Vector(2, 2)
        );
        this.add(colorPlatformThree);
        this.add(colorPlatformTwo);
        this.add(colorPlatformOne);


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

        //second floor
        const pressurePlatePlatform = new PressurePlatePlatform(
            30, -25, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(30, -25),
            new Vector(30, -33),
            192,
            0,
            [],
            new Vector(2, 2)
        );
        this.add(pressurePlatePlatform);
        const boxForPressurePlate = new Box(-3, 0);
        const boxForPressurePlate2ndFloor = new Box(5, -25);

        const pressurePlatePlatform2ndFloorHorizontal = new PressurePlatePlatform(
            56, -34, 100, 20,
            PlatformType.DefaultPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(56, -34),
            new Vector(68, -34),
            192,
            0,
            [],
            new Vector(2, 2)
        );

        const pressurePlatePlatform2ndFloorColor = new PressurePlatePlatform(
            83, -37, 100, 20,
            PlatformType.YellowPlatform,
            186, 60, new Vector(0.5, 0.5),
            new Vector(83, -37),
            new Vector(83, -45),
            192,
            0,
            [2],
            new Vector(2, 2)
        );
        const platformPlate2ndFloorHorizontal = new DefaultPlate(2830, -1440, 0, pressurePlatePlatform2ndFloorColor, boxForPressurePlate2ndFloor);
        const boxForPressurePlateHorizontal = new Box(45, -34);
        const platformPlateHorizontal = new DefaultPlate(1600, -1120, 0, pressurePlatePlatform2ndFloorHorizontal, boxForPressurePlateHorizontal);
        
        this.add(pressurePlatePlatform2ndFloorHorizontal);
        this.add(platformPlateHorizontal);
        this.add(boxForPressurePlateHorizontal);
        this.add(pressurePlatePlatform2ndFloorColor);
        this.add(platformPlate2ndFloorHorizontal);

        //eigenlijk first floor
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
        const platformPlate2ndFloor = new DefaultPlate(800, -800, 0, pressurePlatePlatform, boxForPressurePlate);
        const platformPlate2ndFloor2 = new DefaultPlate(1200, -1120, 0, pressurePlatePlatform, boxForPressurePlate2ndFloor);
        
        this.add(pressurePlatePlatform2ndFloor);
        this.add(platformPlate2ndFloor);
        this.add(platformPlate2ndFloor2);

        const platformPlate = new DefaultPlate(0, 320, 0, pressurePlatePlatform2ndFloor, boxForPressurePlate);

        this.add(platformPlate);
        this.add(boxForPressurePlate)

        // In case it needs a pressure plate to move:
        // You need to pass a Box as the fourth argument. Replace 'null' with the actual Box if needed.
        const boxForPlate1 = new Box(970, 180);
        const boxForPlate2 = new Box(1560, -100);
        this.add(boxForPlate1);
        this.add(boxForPlate2);
        const plate1 = new DefaultPlate(960, 190, 0, plateDoublePlatform, boxForPlate1); // positionX, positionY, platform, targetBox
        const plate2 = new DefaultPlate(1550, -100, 0, plateDoublePlatform, boxForPlate2); // positionX, positionY, platform, targetBox
        this.add(plate1);
        this.add(plate2);

        //jump plate test
        const jumpPlate = new JumpPlate(-80, -800, 900);
        const jumpPlate2 = new JumpPlate(2400, -1540, 900); // Another jump plate for testing
        const jumpPlate3 = new JumpPlate(-1050, -1920, 900); 
        //const jumpPlateTest = new JumpPlate(-80, -800, 900);
        
        this.add(jumpPlate);
        this.add(jumpPlate2);
        this.add(jumpPlate3);
        //this.add(jumpPlateTest);

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
        //this.add(new Portal(-8, 9.5, new Vector(-480, -1000)));
        //this.add(new Portal(-8, 9.5, new Vector(2830, -1500)));

        this.cameraController = new CameraController(engine.currentScene, engine.currentScene.camera);
        this.parallax = new ParallaxBackgroundManager(this, this.camera, engine); // Camera bepaalt deels hoe de achtergrond zich gedraagd

        //hazards
        this.add(new FireWall(52, -24.5, 72, -24.5));
        this.add(new FireWall(80, -30.5, 83, -30.5));
        this.add(new FireWall(83, -25, 86, -25));
        this.add(new FireWall(4, -38.5, 8, -38.5, "down"));
        this.add(new FireWall(15, -38.5, 15, -32, "left"));
        this.add(new FireWall(9.5, -34, 9.5, -25, "right"));
        //this.add(new FireWall(48, -51.5, 50, -51.5));
        this.add(new FireWall(21, -56.5, 24, -56.5));
        this.add(new FireWall(8, -56.5, 11, -56.5));
        this.add(new FireWall(-6, -56.5, -3, -56.5));
        this.add(new FireWall(-23, -56.5, -20, -56.5));
        this.add(new FireWall(34.5, 10.5, 45.5, 10.5));

        //finish
        this.add(new Finish(1856, -2288, 3));
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
        stopAllMusic();
        Resources.gameMusic.loop = true;
        Resources.gameMusic.play();
        Resources.gameMusic.volume = 0.7;

        console.log("level 3 loaded");

      // Reset player positions when level is activated.
        if (this.player1 && this.player2) {
            this.player1.pos = new Vector(-600, 700);
            this.player2.pos = new Vector(-650, 700);
            Resources.finishMSG.stop();
        }
    }
}