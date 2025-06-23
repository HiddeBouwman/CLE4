import { Scene, Actor, Label, Color, Font, FontUnit, TextAlign, Buttons, Engine, Axes } from "excalibur";
import { Resources } from "../resources.ts";

export class StartMenu extends Scene {
    private menuButtons: Label[] = [];
    private selectedIndex: number = 0;
    private lastStickY: number = 0;

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

        //button via label class
        const button_backwardslevel = new Label({
            text: "Backwards Level",
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

        //  Dressing Room button.
        const button_dressingRoom = new Label({
            text: "Change skin",
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2 + 150,
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
            Resources.FinishMC.stop();
        });

        //register clicks on label
        button_level3.on('pointerup', () => {
            engine.goToScene('level3');
            Resources.FinishMC.stop();
        });

        //register clicks on label
        button_backwardslevel.on('pointerup', () => {
            engine.goToScene('backwardslevel');
            Resources.FinishMC.stop();
        });

        //register clicks on label
        button_dressingRoom.on('pointerup', () => {
            engine.goToScene('dressingRoom');

            console.log("A");
            // Resources.FinishMC.stop();
        });


        // Add all buttons.
        this.add(titleLabel);
        this.add(button_level1);
        this.add(button_level3);
        this.add(button_backwardslevel);
        this.add(button_dressingRoom);




         this.menuButtons = [
            button_level1,
            button_level3,
            button_backwardslevel,
            button_dressingRoom
        ];

        // Add all buttons to the scene
        this.add(titleLabel);
        this.menuButtons.forEach(btn => this.add(btn));

        // Highlight the first button
        this.highlightSelected();

        // Optionally, listen for keyboard as well
        engine.input.keyboard.on('press', (evt) => {
            if (evt.key === 'ArrowDown') {
                this.selectedIndex = (this.selectedIndex + 1) % this.menuButtons.length;
                this.highlightSelected();
            } else if (evt.key === 'ArrowUp') {
                this.selectedIndex = (this.selectedIndex - 1 + this.menuButtons.length) % this.menuButtons.length;
                this.highlightSelected();
            } else if (evt.key === 'Enter') {
                this.activateSelected(engine);
            }
        });
    }



    onPreUpdate(engine: Engine) {
        const gamepad = engine.input.gamepads.at(0); // Use first gamepad

        if (gamepad) {
            // Up/Down navigation with stick or dpad
            const stickY = gamepad.getAxes(Axes.LeftStickY);

            // Deadzone and edge detection for stick
            if (stickY > 0.5 && this.lastStickY <= 0.5) {
                this.selectedIndex = (this.selectedIndex + 1) % this.menuButtons.length;
                this.highlightSelected();
            } else if (stickY < -0.5 && this.lastStickY >= -0.5) {
                this.selectedIndex = (this.selectedIndex - 1 + this.menuButtons.length) % this.menuButtons.length;
                this.highlightSelected();
            }
            this.lastStickY = stickY;

            // Dpad navigation
            if (gamepad.isButtonPressed(Buttons.DpadDown)) {
                this.selectedIndex = (this.selectedIndex + 1) % this.menuButtons.length;
                this.highlightSelected();
            } else if (gamepad.isButtonPressed(Buttons.DpadUp)) {
                this.selectedIndex = (this.selectedIndex - 1 + this.menuButtons.length) % this.menuButtons.length;
                this.highlightSelected();
            }

            // Activate with Face1 (A/X)
            if (gamepad.isButtonPressed(Buttons.Face1)) {
                this.activateSelected(engine);
            }
        }
    }

    highlightSelected() {
        this.menuButtons.forEach((btn, idx) => {
            btn.color = idx === this.selectedIndex ? Color.Yellow : Color.Black;
        });
    }

    activateSelected(engine: Engine) {
        switch (this.selectedIndex) {
            case 0:
                engine.goToScene('level1');
                Resources.FinishMC.stop();
                break;
            case 1:
                engine.goToScene('level3');
                Resources.FinishMC.stop();
                break;
            case 2:
                engine.goToScene('backwardslevel');
                Resources.FinishMC.stop();
                break;
            case 3:
                engine.goToScene('dressingRoom');
                break;
        }
    }
    
}