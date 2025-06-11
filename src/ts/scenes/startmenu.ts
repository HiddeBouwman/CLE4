import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign } from "excalibur";

export class StartMenu extends Scene {
    constructor() {
        super();
        console.log("game started");
    }

    onInitialize(engine) {
        // Create a button (as a label)
        const button = new Label({
            text: "Start Level 1",
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            font: new Font({
                size: 32,
                unit: FontUnit.Px,
                color: Color.White,
                textAlign: TextAlign.Center
            }),
            color: Color.Black
        });

        // Make the label clickable
        button.on('pointerup', () => {
            engine.goToScene('level1');
        });

        this.add(button);
    }
}