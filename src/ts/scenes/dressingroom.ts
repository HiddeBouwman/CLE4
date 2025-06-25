import {
    Actor,
    Color,
    Font,
    FontUnit,
    Label,
    Scene,
    TextAlign,
    Vector,
    Keys,
    Engine,
} from "excalibur";
import { Resources, stopAllMusic } from "../resources.ts";
import { Cosmetic } from "../cosmetic.ts";
import { LevelManager } from "../levelManager.ts";

export class dressingRoom extends Scene {
    player1Cosmetic: Cosmetic;
    player2Cosmetic: Cosmetic;
    player1Actor: Actor;
    player2Actor: Actor;
    
    // Track control state to prevent rapid input
    private keyDebounceTimer: number = 0;
    private keyDebounceDelay: number = 200; // milliseconds

    // Timer for holding S or Down to return to menu
    private returnToMenuTimer: number = 0;
    private returnToMenuDelay: number = 1000; // milliseconds

    constructor() {
        super();
        console.log("Dressing room");
    }

    onInitialize(engine: Engine) {
        Resources.changeSkin.play();
        Resources.changeSkin.volume = 0.3;

        // Initialize LevelManager
        LevelManager.initLevelStorage();

        // Add background
        const background = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            width: engine.drawWidth,
            height: engine.drawHeight,
        });
        background.graphics.opacity = 0.3;
        background.graphics.color = Color.Gray;
        this.add(background);

        // Add title label at the top
        const titleLabel = new Label({
            text: "Choose skin",
            x: engine.drawWidth / 2,
            y: 70,
            font: new Font({
                size: 48,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center,
            }),
        });

        // Add controls explanation label
        const controlsLabel = new Label({
            text: "Controls: A/D or ←/→ to cycle skins, W or ↑ to select\nHold S or ↓ for 1 second or press B button to return to menu",
            x: engine.drawWidth / 2,
            y: engine.drawHeight - 70,
            font: new Font({
                size: 20,
                unit: FontUnit.Px,
                color: Color.Black,
                textAlign: TextAlign.Center,
            }),
        });
        
        // Helper function to create player character actors
        const createPlayerActor = (playerNumber: number, xPos: number) => {
            // Create player sprite
            const playerSprite = Resources.CharacterSheet.toSprite();
            playerSprite.sourceView = {
                x: 0,
                y: playerNumber === 1 ? 0 : 64,  // Y position based on player number
                width: 32,
                height: 32,
            };
            
            // Create player actor
            const playerActor = new Actor({
                x: xPos,
                y: engine.drawHeight / 2 + 30,
                width: 32,
                height: 32,
            });
            
            // Scale and set sprite
            playerActor.scale = new Vector(2, 1.5);
            playerActor.graphics.use(playerSprite);
            
            // Add player label
            const playerLabel = new Label({
                text: `${playerNumber === 1 ? 'Bip' : 'Kaz'}`,
                x: xPos,
                y: engine.drawHeight / 2 - 70,
                font: new Font({
                    size: 24,
                    unit: FontUnit.Px,
                    color: Color.Black,
                    textAlign: TextAlign.Center,
                }),
            });
            
            // Add to scene
            this.add(playerActor);
            this.add(playerLabel);
            
            return { playerActor, playerLabel };
        };
        
        // Create both player actors
        const { playerActor: player1Actor } = createPlayerActor(1, engine.drawWidth / 2 - 100);
        const { playerActor: player2Actor } = createPlayerActor(2, engine.drawWidth / 2 + 100);
        
        // Store player actors
        this.player1Actor = player1Actor;
        this.player2Actor = player2Actor;

        // Create player cosmetics and add them as children to the player actors
        this.player1Cosmetic = new Cosmetic(1);
        this.player1Actor.addChild(this.player1Cosmetic);
        this.player1Cosmetic.setupAsPreview(engine);
        
        this.player2Cosmetic = new Cosmetic(2);
        this.player2Actor.addChild(this.player2Cosmetic);
        this.player2Cosmetic.setupAsPreview(engine);

        
        // Add unlocked level info
        const unlockedLevelInfo = new Label({
            text: `Unlocked Level: ${LevelManager.getUnlockedLevel()}`,
            x: engine.drawWidth / 2,
            y: 160,
            font: new Font({
                size: 18,
                unit: FontUnit.Px,
                color: Color.Blue,
                textAlign: TextAlign.Center,
            }),
        });

        // Add all UI elements
        this.add(titleLabel);
        this.add(controlsLabel);
        this.add(unlockedLevelInfo);
    }

    onActivate() {
        stopAllMusic();
        Resources.changeSkin.loop = true;
        Resources.changeSkin.play();
        console.log("Dressing Room activated - keyboard controls ready");
    }

    onPreUpdate(engine: Engine, delta: number) {
        // Decrease debounce timer
        if (this.keyDebounceTimer > 0) {
            this.keyDebounceTimer -= delta;
        }

        // Only process input if debounce timer is expired
        if (this.keyDebounceTimer <= 0) {
            this.handleKeyboardInput(engine);
            this.handleGamepadInput(engine);
        }

        // Check for holding S or Down to return to menu
        const sKeyHeld = engine.input.keyboard.isHeld(Keys.S);
        const downKeyHeld = engine.input.keyboard.isHeld(Keys.Down);
        
        // Check gamepads for B button (back) press
        let gamepadBackPressed = false;
        const gamepad1 = navigator.getGamepads?.()?.[0];
        const gamepad2 = navigator.getGamepads?.()?.[1];
        
        if (gamepad1 && gamepad1.buttons[1]?.pressed) { // B button on Xbox controller
            gamepadBackPressed = true;
        }
        
        if (gamepad2 && gamepad2.buttons[1]?.pressed) { // B button on Xbox controller
            gamepadBackPressed = true;
        }
        
        // Immediate return to menu if gamepad B button is pressed
        if (gamepadBackPressed && this.keyDebounceTimer <= 0) {
            console.log("Gamepad B button pressed, returning to menu");
            engine.goToScene("menu");
            this.keyDebounceTimer = 500; // Prevent multiple transitions
            return;
        }
        
        // Handle keyboard return to menu timer
        if (sKeyHeld || downKeyHeld) {
            this.returnToMenuTimer += delta;
            
            // Visual feedback that we're holding to return
            if (this.returnToMenuTimer > 250) { // After 0.25s, start visual feedback
                const progress = Math.min(this.returnToMenuTimer / this.returnToMenuDelay, 1);
                console.log(`Return to menu progress: ${Math.round(progress * 100)}%`);
            }
            
            // Check if we've held the button long enough
            if (this.returnToMenuTimer >= this.returnToMenuDelay) {
                console.log("Return to menu timer completed, going to menu");
                engine.goToScene("menu");
                this.returnToMenuTimer = 0;
            }
        } else {
            // Reset timer if key not held
            this.returnToMenuTimer = 0;
        }

        // Check for level reset key combination (K + L)
        if (engine.input.keyboard.isHeld(Keys.K) && engine.input.keyboard.isHeld(Keys.L)) {
            LevelManager.resetLevels();
            this.player1Cosmetic.setCosmetic();
            this.player2Cosmetic.setCosmetic();
            console.log("Levels and cosmetics reset");
            
            // Debounce to prevent multiple resets
            this.keyDebounceTimer = 1000;
        }
    }

    handleKeyboardInput(engine: Engine) {
        // Player 1 controls (A/D for cycling, W for selection)
        if (engine.input.keyboard.wasPressed(Keys.A)) {
            console.log("Player 1: A key pressed - cycling previous");
            this.player1Cosmetic.cyclePrevious();
            this.keyDebounceTimer = this.keyDebounceDelay;
        }
        if (engine.input.keyboard.wasPressed(Keys.D)) {
            console.log("Player 1: D key pressed - cycling next");
            this.player1Cosmetic.cycleNext();
            this.keyDebounceTimer = this.keyDebounceDelay;
        }
        if (engine.input.keyboard.wasPressed(Keys.W)) {
            console.log("Player 1: W key pressed - selecting");
            this.player1Cosmetic.select();
            this.keyDebounceTimer = this.keyDebounceDelay;
        }

        // Player 2 controls (Arrow keys)
        if (engine.input.keyboard.wasPressed(Keys.Left)) {
            console.log("Player 2: Left key pressed - cycling previous");
            this.player2Cosmetic.cyclePrevious();
            this.keyDebounceTimer = this.keyDebounceDelay;
        }
        if (engine.input.keyboard.wasPressed(Keys.Right)) {
            console.log("Player 2: Right key pressed - cycling next");
            this.player2Cosmetic.cycleNext();
            this.keyDebounceTimer = this.keyDebounceDelay;
        }
        if (engine.input.keyboard.wasPressed(Keys.Up)) {
            console.log("Player 2: Up key pressed - selecting");
            this.player2Cosmetic.select();
            this.keyDebounceTimer = this.keyDebounceDelay;
        }
    }
    
    handleGamepadInput(engine: Engine) {
        // Handle player 1 gamepad (index 0)
        const gamepad1 = navigator.getGamepads?.()?.[0];
        if (gamepad1) {
            // Check directional input for cycling
            if ((gamepad1.axes[0] < -0.5 || gamepad1.buttons[14]?.pressed) && this.keyDebounceTimer <= 0) {
                this.player1Cosmetic.cyclePrevious();
                this.keyDebounceTimer = this.keyDebounceDelay;
            }
            if ((gamepad1.axes[0] > 0.5 || gamepad1.buttons[15]?.pressed) && this.keyDebounceTimer <= 0) {
                this.player1Cosmetic.cycleNext();
                this.keyDebounceTimer = this.keyDebounceDelay;
            }
            // Select with A button or Up
            if ((gamepad1.buttons[0]?.pressed || gamepad1.buttons[12]?.pressed) && this.keyDebounceTimer <= 0) {
                this.player1Cosmetic.select();
                this.keyDebounceTimer = this.keyDebounceDelay;
            }
        }
        
        // Handle player 2 gamepad (index 1)
        const gamepad2 = navigator.getGamepads?.()?.[1];
        if (gamepad2) {
            // Check directional input for cycling
            if ((gamepad2.axes[0] < -0.5 || gamepad2.buttons[14]?.pressed) && this.keyDebounceTimer <= 0) {
                this.player2Cosmetic.cyclePrevious();
                this.keyDebounceTimer = this.keyDebounceDelay;
            }
            if ((gamepad2.axes[0] > 0.5 || gamepad2.buttons[15]?.pressed) && this.keyDebounceTimer <= 0) {
                this.player2Cosmetic.cycleNext();
                this.keyDebounceTimer = this.keyDebounceDelay;
            }
            // Select with A button or Up
            if ((gamepad2.buttons[0]?.pressed || gamepad2.buttons[12]?.pressed) && this.keyDebounceTimer <= 0) {
                this.player2Cosmetic.select();
                this.keyDebounceTimer = this.keyDebounceDelay;
            }
        }
    }
}
