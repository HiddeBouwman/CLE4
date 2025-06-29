import "../styles/style.css";
import { DisplayMode, Engine, Timer, SolverStrategy, Vector } from "excalibur";
import { ResourceLoader } from "./resources.ts";
import { Color } from "excalibur";
import { StartMenu } from './scenes/startmenu.ts';
import { LevelOne } from './scenes/level1.ts';
import { LevelTwo } from './scenes/level2.ts';
import { LevelThree } from './scenes/level3.ts';
import { player1 } from './scenes/player1.ts';
import { player2 } from './scenes/player2.ts';
import { dressingRoom } from './scenes/dressingroom.ts';

export class Game extends Engine {
    mygamepad

    constructor() {
        super({
            width: 800,
            height: 500,
            maxFps: 30,
            pixelArt: true,
            // pixelRatio: 1,
            suppressHiDPIScaling: true,
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Arcade,
                gravity: new Vector(0, 1200),
            }
        });

        this.backgroundColor = Color.fromHex("#1C252A");
        // this.showDebug(true)

        // Start game
        this.start(ResourceLoader).then(() => this.#startGame());
    }

    #startGame() {
        this.input.gamepads.enabled = true
        this.input.gamepads.on('connect', (connectevent) => {
            console.log("gamepad detected")
            this.mygamepad = connectevent.gamepad
        })

        console.log("start de game!");
        //add and load start menu scene
        this.add('menu', new StartMenu());
        this.add('level1', new LevelOne());
        this.add('level2', new LevelTwo());
        this.add('level3', new LevelThree());
        this.add('player1', new player1());
        this.add('player2', new player2());
        this.add('dressingRoom', new dressingRoom());
        this.goToScene('menu');
    }
}

new Game();

