import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign } from "excalibur";
import { Resources } from "../resources.ts";

export class StartMenu extends Scene {
    constructor() {
        super();
        console.log("game started");
        Resources.Menu.play();
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
            text: "Level 1",
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

          //button via label class
        const button_level3 = new Label({
            text: "Level 3",
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2 + 50,
            font: new Font({
                size: 32,
                unit: FontUnit.Px,
                color: Color.White,
                textAlign: TextAlign.Center
            }),
            color: Color.Black
        });
       
        //  Dressing Room button.
        const button_dressingRoom = new Label({
            text: "Change skin",
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2 + 100,
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
            engine.goToScene('backwardslevel');
            Resources.FinishMC.stop();
        });

        //register clicks on label
        button_level3.on('pointerup', () => {
            engine.goToScene('level3');
            Resources.FinishMC.stop();
        });


        //register clicks on label
        button_dressingRoom.on('pointerup', () => {
            engine.goToScene('dressingRoom');
            // Resources.FinishMC.stop();
        });

        // Add all buttons.
        this.add(button_level1);
        this.add(button_level3);
        this.add(button_dressingRoom);

    }
}