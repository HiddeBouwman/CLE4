import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign } from "excalibur";
import { Resources } from "../resources.ts";

export class dressingRoom extends Scene {
    constructor() {
        super();
        console.log("Dressing room");
        Resources.Menu.play();
    }

    onInitialize(engine) {
        // Add title label at the top
        const choosePlayer_title = new Label({
            text: "Choose player",
            x: engine.drawWidth / 2,
            y: 100, 
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center
            })
        });

        //register clicks on label
        choosePlayer_title.on('pointerup', () => {
            engine.goToScene('choosePlayer_title');
            // Resources.FinishMC.stop();
        });

        // Add all buttons.
        this.add(choosePlayer_title);

    }
}