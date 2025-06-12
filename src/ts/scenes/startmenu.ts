import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign } from "excalibur";

export class StartMenu extends Scene {
    constructor() {
        super();
        console.log("game started");
    }

    onInitialize(engine) {
        // Add title label at the top
        const titleLabel = new Label({
            text: "Choose level",
            x: engine.drawWidth / 2,
            y: 100, 
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center
            })
        });
        this.add(titleLabel);

        //button via label class
        const button_level1 = new Label({
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

        //register clicks on label
        button_level1.on('pointerup', () => {
            engine.goToScene('level1');
        });
        this.add(button_level1);
    }
}