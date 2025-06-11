import { Scene } from "excalibur";


export class LevelOne extends Scene {
    constructor() {
        super();
    }

    onActivate() {
        console.log("level 1 loaded");
    }
}
