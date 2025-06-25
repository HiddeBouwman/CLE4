import { Actor, CollisionType, Color, Sprite, Vector, Timer, Engine } from "excalibur";
import { Resources } from "./resources";
import { LevelManager } from "./levelManager";

// Create and export the enum for cosmetic types
export enum CosmeticType {
    None = "none",
    Drip = "drip",
    Kid = "kid",
    Gold = "gold",
    Crown = "crown",
}

interface LocalStorageCosmetics {
    player1: CosmeticType;
    player2: CosmeticType;
}

export class Cosmetic extends Actor {
    playerNumber: number;
    curentCosmetic: Sprite[];
    cosmetics: Record<CosmeticType, { idle: Sprite; walk: Sprite }>;
    
    // For selection UI
    isBlinking: boolean = false;
    blinkTimer: Timer;
    currentSelection: number = 0;
    cosmeticTypes: CosmeticType[];
    lockedFilter: Color = new Color(30, 30, 30, 1); // Dark filter for locked items

    constructor(playerNumber: number) {
        super({
            width: 32,
            height: 32,
            collisionType: CollisionType.PreventCollision,
        });
        this.playerNumber = playerNumber;

        // Store cosmetic types for cycling
        this.cosmeticTypes = Object.values(CosmeticType);
        
        // Initialize cosmetics object with proper typing
        this.cosmetics = {} as Record<
            CosmeticType,
            { idle: Sprite; walk: Sprite }
        >;

        // Add 'none' with special coordinates
        this.cosmetics[CosmeticType.None] = {
            idle: new Sprite({
                image: Resources.Cosmetics,
                sourceView: {
                    x: 200,
                    y: 200,
                    width: 32,
                    height: 32,
                },
            }),
            walk: new Sprite({
                image: Resources.Cosmetics,
                sourceView: {
                    x: 200,
                    y: 200,
                    width: 32,
                    height: 32,
                },
            }),
        };

        // Generate sprite coordinates for other cosmetic types
        const generateCosmetics = () => {
            // Start from index 1 to skip 'none' which we defined separately
            for (let i = 1; i < this.cosmeticTypes.length; i++) {
                const cosmeticType = this.cosmeticTypes[i] as CosmeticType;
                const column = i - 1; // Column index (0-based for actual cosmetics)

                // Calculate row based on player number
                // Player 1: rows 0 (idle) and 1 (walk)
                // Player 2: rows 2 (idle) and 3 (walk)
                const baseRow = this.playerNumber === 1 ? 0 : 2;

                this.cosmetics[cosmeticType] = {
                    idle: new Sprite({
                        image: Resources.Cosmetics,
                        sourceView: {
                            x: column * 32, // Each column is 32px wide
                            y: baseRow * 32, // Idle row
                            width: 32,
                            height: 32,
                        },
                    }),
                    walk: new Sprite({
                        image: Resources.Cosmetics,
                        sourceView: {
                            x: column * 32,
                            y: (baseRow + 1) * 32, // Walk row (one below idle)
                            width: 32,
                            height: 32,
                        },
                    }),
                };
            }
        };

        generateCosmetics();

        this.initLocalStorage();
        this.setCosmetic();
        
        // Initialize blink timer
        this.blinkTimer = new Timer({
            fcn: () => this.toggleBlink(),
            interval: 500,
            repeats: true
        });
        
        // Enable debugging
        console.log(`Cosmetic for Player ${playerNumber} created`);
    }

    initLocalStorage() {
        // If there is no cosmetics object creates one
        if (!localStorage.getItem("cosmetics")) {
            const defaultCosmetics: LocalStorageCosmetics = {
                player1: CosmeticType.None,
                player2: CosmeticType.None,
            };
            localStorage.setItem("cosmetics", JSON.stringify(defaultCosmetics));
        }
    }

    setCosmetic() {
        // If the cosmetics object exists parses it and puts the correct cosmetic in the curentCosmetic variable
        if (localStorage.getItem("cosmetics")) {
            const cosmeticsStr = localStorage.getItem("cosmetics");
            if (cosmeticsStr) {
                const cosmetics = JSON.parse(
                    cosmeticsStr,
                ) as LocalStorageCosmetics;
                const playerKey = this.playerNumber === 1
                    ? "player1"
                    : "player2";
                const selectedCosmeticKey =
                    cosmetics[playerKey] as CosmeticType;

                // Check if the selected cosmetic exists
                if (!this.cosmetics[selectedCosmeticKey]) {
                    this.curentCosmetic = [
                        this.cosmetics[CosmeticType.None].idle,
                        this.cosmetics[CosmeticType.None].walk,
                    ];
                } else {
                    this.curentCosmetic = [
                        this.cosmetics[selectedCosmeticKey].idle,
                        this.cosmetics[selectedCosmeticKey].walk,
                    ];
                }
                this.graphics.use(this.curentCosmetic[0]);
                
                // Set the current selection index based on the saved cosmetic
                const index = this.cosmeticTypes.findIndex(type => type === selectedCosmeticKey);
                if (index !== -1) {
                    this.currentSelection = index;
                }
            }
        } else {
            this.initLocalStorage();
            this.setCosmetic();
        }
    }

    // Get currently selected cosmetic type
    getCurrentCosmeticType(): CosmeticType {
        return this.cosmeticTypes[this.currentSelection];
    }

    // Update the cosmetic display based on the current selection
    updateCosmeticDisplay() {
        const selectedType = this.getCurrentCosmeticType();
        console.log(`Player ${this.playerNumber} displaying cosmetic: ${selectedType}`);
        
        // Check if cosmetic is unlocked
        const isUnlocked = LevelManager.isCosmeticUnlocked(selectedType);
        
        if (this.cosmetics[selectedType]) {
            this.graphics.use(this.cosmetics[selectedType].idle);
            
            // Apply locked filter if needed
            if (!isUnlocked) {
                this.graphics.opacity = 0.6;
                this.graphics.color = this.lockedFilter;
            } else {
                this.graphics.opacity = this.isBlinking ? 0.5 : 1;
                this.graphics.color = Color.White;
            }
        }
    }
    
    // Cycle to the next available cosmetic
    cycleNext() {
        this.currentSelection = (this.currentSelection + 1) % this.cosmeticTypes.length;
        console.log(`Player ${this.playerNumber} cycling next to: ${this.getCurrentCosmeticType()}`);
        
        // Restart blinking when cycling
        this.isBlinking = false;
        if (!this.blinkTimer.isRunning) {
            this.blinkTimer.start();
        }
        
        this.updateCosmeticDisplay();
    }
    
    // Cycle to the previous available cosmetic
    cyclePrevious() {
        this.currentSelection = (this.currentSelection - 1 + this.cosmeticTypes.length) % this.cosmeticTypes.length;
        console.log(`Player ${this.playerNumber} cycling previous to: ${this.getCurrentCosmeticType()}`);
        
        // Restart blinking when cycling
        this.isBlinking = false;
        if (!this.blinkTimer.isRunning) {
            this.blinkTimer.start();
        }
        
        this.updateCosmeticDisplay();
    }
    
    // Select the current cosmetic
    select() {
        const selectedType = this.getCurrentCosmeticType();
        if (LevelManager.isCosmeticUnlocked(selectedType)) {
            this.switchCosmetic(this.playerNumber, selectedType);
            
            // Stop blinking when selected
            this.stopBlinking();
            
            // Make the cosmetic fully opaque
            this.graphics.opacity = 1;
            
            console.log(`Player ${this.playerNumber} selected: ${selectedType}`);
            return true;
        }
        console.log(`Player ${this.playerNumber} cannot select locked cosmetic: ${selectedType}`);
        return false;
    }
    
    // Toggle blink effect for cosmetics
    toggleBlink() {
        this.isBlinking = !this.isBlinking;
        this.updateCosmeticDisplay();
    }
    
    // Start blinking effect
    startBlinking(engine: Engine) {
        engine.add(this.blinkTimer);
        this.blinkTimer.start();
    }
    
    // Stop blinking effect
    stopBlinking() {
        this.blinkTimer.stop();
        this.isBlinking = false;
        this.updateCosmeticDisplay();
    }

    // This function sets up this cosmetic as a preview in the dressing room
    setupAsPreview(engine: Engine) {
        this.pos = new Vector(0, 0);
        this.scale = new Vector(3, 4);
        
        // Find the saved cosmetic and set it as the current selection
        const cosmeticsStr = localStorage.getItem("cosmetics");
        if (cosmeticsStr) {
            const cosmetics = JSON.parse(cosmeticsStr) as LocalStorageCosmetics;
            const playerKey = this.playerNumber === 1 ? "player1" : "player2";
            const currentCosmeticType = cosmetics[playerKey] as CosmeticType;
            
            // Find the index of the saved cosmetic
            const index = this.cosmeticTypes.findIndex(type => type === currentCosmeticType);
            if (index !== -1) {
                this.currentSelection = index;
            }
        }
        
        // Make sure we're visible and start blinking
        this.updateCosmeticDisplay();
        this.startBlinking(engine);
        
        console.log(`Player ${this.playerNumber} cosmetic preview setup as child of player actor`);
    }

    // Switch the saved cosmetic from the localtorage with a diffrent key
    switchCosmetic(playerNumber: number, cosmeticKey: CosmeticType) {
        const cosmeticsStr = localStorage.getItem("cosmetics");
        if (cosmeticsStr) {
            const cosmetics = JSON.parse(cosmeticsStr) as LocalStorageCosmetics;

            if (playerNumber === 1) {
                cosmetics.player1 = cosmeticKey;
            } else if (playerNumber === 2) {
                cosmetics.player2 = cosmeticKey;
            }

            localStorage.setItem("cosmetics", JSON.stringify(cosmetics));
            console.log(`Saved cosmetic for Player ${playerNumber}: ${cosmeticKey}`);
        }
    }

    // Makes sure that the walking animation also functions for the cosmetic
    switchCosmeticState(isWalking: boolean, flipHorizontal: boolean) {
        if (this.curentCosmetic) {
            // Use either idle (0) or walk (1) sprite based on isWalking parameter
            this.graphics.use(this.curentCosmetic[isWalking ? 1 : 0]);
            // Match the flip direction of the player
            this.graphics.flipHorizontal = flipHorizontal;
        }
    }
}
