import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign, Sprite } from "excalibur";
import { Resources } from "../resources.ts";

export class player2 extends Scene {
    constructor() {
        super();
        console.log("Player 2 cosmetics");
    }

    onInitialize(engine) {

        Resources.changeSkin.play();

    // Add title label at the top
        const titleLabel = new Label({
            text: "Player 2 change your skin!",
            x: engine.drawWidth / 2,
            y: 60, 
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
            y: 100, 
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center
            })
        });

        // Player 2 sprite
        const player2Sprite = Resources.CharacterSheet.toSprite();
        player2Sprite.sourceView = {
            x: 0,
            y: 64,
            width: 32,
            height: 32
        };
        const player2Actor = new Actor({
            x: engine.drawWidth / 2 - 60,
            y: engine.drawHeight / 2,
            width: 64,
            height: 64
        });
        player2Actor.graphics.use(player2Sprite);

        // Add pointer event listeners
        player2Actor.on('pointerup', () => {
            console.log('player 2');
            
        });
        
        // Add pointer event listeners
        changePlayer_return.on('pointerup', () => {
            engine.goToScene('dressingRoom');
        });
             
        this.add(player2Actor);
        this.add(titleLabel);
        this.add(changePlayer_return);
    }
}