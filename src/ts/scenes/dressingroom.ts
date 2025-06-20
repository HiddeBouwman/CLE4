import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign, Sprite } from "excalibur";
import { Resources } from "../resources.ts";

export class dressingRoom extends Scene {
    constructor() {
        super();
        console.log("Dressing room");
    }

    onInitialize(engine) {

                Resources.changeSkin.play();
                Resources.gameMusic.loop = true;

        // Add title label
        const choosePlayer_title = new Label({
            text: "Choose Player",
            x: engine.drawWidth / 2,
            y: 100, 
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center
            })
        });

        //register click on label.
        choosePlayer_title.on('pointerup', () => {
            engine.goToScene('choosePlayer_title');
            // Resources.FinishMC.stop();
        });

        // Player 1 sprite
        const player1Sprite = Resources.CharacterSheet.toSprite();
        player1Sprite.sourceView = {
            x: 0,
            y: 0,
            width: 32,
            height: 32
        };
        const player1Actor = new Actor({
            x: engine.drawWidth / 2 - 60,
            y: engine.drawHeight / 2,
            width: 64,
            height: 64
        });
        player1Actor.graphics.use(player1Sprite);

        // Player 2 sprite
        const player2Sprite = Resources.CharacterSheet.toSprite();
        player2Sprite.sourceView = {
            x: 0,
            y: 64,
            width: 32,
            height: 32
        };
        const player2Actor = new Actor({
            x: engine.drawWidth / 2 + 60,
            y: engine.drawHeight / 2,
            width: 64,
            height: 64
        });
        player2Actor.graphics.use(player2Sprite);

        // Add all buttons/text
        this.add(player1Actor);
        this.add(player2Actor);
        this.add(choosePlayer_title);
    }
}