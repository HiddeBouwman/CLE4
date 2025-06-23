import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign, Sprite } from "excalibur";
import { Resources, stopAllMusic } from "../resources.ts";

export class dressingRoom extends Scene {
    constructor() {
        super();
        console.log("Dressing room");
    }

    onInitialize(engine) {

        Resources.changeSkin.play();

        // Add title label at the top
        const titleLabel = new Label({
            text: "Choose skin",
            x: engine.drawWidth / 2,
            y: 100,
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center
            })
        });

         const gameMenu_return = new Label({
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

        // Add pointer event listeners
        player1Actor.on('pointerup', () => {
            console.log('player 1');
            engine.goToScene('player1');
        });

        player2Actor.on('pointerup', () => {
            console.log('player 2');
            engine.goToScene('player2');
        });

          gameMenu_return.on('pointerup', () => {
            console.log('return to game menu');
            engine.goToScene('menu');
        });

        // Buttons
        this.add(player1Actor);
        this.add(player2Actor);
        this.add(titleLabel);
        this.add(gameMenu_return);
    }

    onActivate() {
    stopAllMusic();
    Resources.changeSkin.loop = true;
    Resources.changeSkin.play();
}
}

