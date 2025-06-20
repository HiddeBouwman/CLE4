import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign, Sprite } from "excalibur";
import { Resources } from "../resources.ts";

export class player1 extends Scene {
    constructor() {
        super();
        console.log("Player 1 cosmetics");
    }

    onInitialize(engine) {

        Resources.changeSkin.play();

        // Add title label at the top
        const titleLabel = new Label({
            text: "Player 1 change your skin!",
            x: engine.drawWidth / 2,
            y: 100,
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center
            })
        });

        const changePlayer_return = new Label({
            text: "Return to game menu!",
            x: engine.drawWidth / 2,
            y: 60,
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center
            })
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

        // Add pointer event listeners
        player1Actor.on('pointerup', () => {
            console.log('player 1');
        });

        // Add pointer event listeners
        changePlayer_return.on('pointerup', () => {
            console.log('return to select player');
            engine.goToScene('dressingRoom');
        });

        this.add(player1Actor);
        this.add(titleLabel);
        this.add(changePlayer_return);
    }
}