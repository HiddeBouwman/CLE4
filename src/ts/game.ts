import "../styles/style.css";
import { DisplayMode, Engine, Timer, SolverStrategy, Vector } from "excalibur";
import { ResourceLoader } from "./resources.ts";
import { Color } from "excalibur";
import { StartMenu } from './scenes/startmenu.ts';
import { LevelOne } from './scenes/level1.ts';
import { LevelTwo } from './scenes/level2.ts';
import { LevelThree } from './scenes/level3.ts';
import { BackwardsLevel } from "./scenes/backwardslevel.ts";

export class Game extends Engine {
    constructor() {
        super({
            width: 800,
            height: 600,
            maxFps: 60,
            pixelArt: true,
            // pixelRatio: 1,
            suppressHiDPIScaling: true,
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Arcade,
                gravity: new Vector(0, 1200),
            }
        });

        this.backgroundColor = Color.fromHex("#5fb2e9");
        this.showDebug(true)

        // Start game
        this.start(ResourceLoader).then(() => this.#startGame());
    }

    #startGame() {
        console.log("start de game!");
        //add and load start menu scene
        this.add('menu', new StartMenu());
        this.add('level1', new LevelOne());
        this.add('level2', new LevelTwo());
        this.add('level3', new LevelThree());
        this.add('backwardslevel', new BackwardsLevel());
        this.goToScene('menu');
    }
}

new Game();

