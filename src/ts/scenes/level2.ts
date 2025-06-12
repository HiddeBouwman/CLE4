import { Scene } from "excalibur";


export class LevelTwo extends Scene {
    constructor() {
        super();
    }

    onActivate() {
        console.log("level 2 loaded");
    }
}