import "../styles/style.css";
import { DisplayMode, Engine, Timer } from "excalibur";
import { ResourceLoader } from "./resources.ts";
import { Color } from "excalibur";

export class Game extends Engine {
    constructor() {
        super({
            width: 800,
            height: 600,
            maxFps: 60,
            pixelArt: true,
            suppressHiDPIScaling: true,
            displayMode: DisplayMode.FitScreen,
        });

        this.backgroundColor = Color.fromHex("#5fb2e9");

        // Start game
        this.start(ResourceLoader).then(() => this.startGame());
    }

    startGame() {
        console.log("start de game!");
    }
}

new Game();
