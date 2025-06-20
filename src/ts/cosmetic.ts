import { Actor, CollisionType, Sprite, Vector } from "excalibur";
import { Resources } from "./resources";

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

    constructor(playerNumber: number) {
        super({
            width: 1,
            height: 1,
            collisionType: CollisionType.PreventCollision,
        });
        this.playerNumber = playerNumber;

        // Define array based on enum values
        const cosmeticTypes = Object.values(CosmeticType);

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
            for (let i = 1; i < cosmeticTypes.length; i++) {
                const cosmeticType = cosmeticTypes[i] as CosmeticType;
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
    }

    initLocalStorage() {
        if (!localStorage.getItem("cosmetics")) {
            const defaultCosmetics: LocalStorageCosmetics = {
                player1: CosmeticType.None,
                player2: CosmeticType.None,
            };
            localStorage.setItem("cosmetics", JSON.stringify(defaultCosmetics));
        }
    }

    setCosmetic() {
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
            }
        } else {
            this.initLocalStorage();
            this.setCosmetic();
        }
    }

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
        }
    }

    switchCosmeticState(isWalking: boolean, flipHorizontal: boolean) {
        if (this.curentCosmetic) {
            // Use either idle (0) or walk (1) sprite based on isWalking parameter
            this.graphics.use(this.curentCosmetic[isWalking ? 1 : 0]);
            // Match the flip direction of the player
            this.graphics.flipHorizontal = flipHorizontal;
        }
    }
}
