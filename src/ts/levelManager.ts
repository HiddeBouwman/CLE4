import { CosmeticType } from "./cosmetic";

export class LevelManager {
    static initLevelStorage() {
        if (!localStorage.getItem("level")) {
            // For testing, start with all cosmetics unlocked
            // In production, you'd want to set this to 0
            localStorage.setItem("level", JSON.stringify({ unlockedLevel: 0 }));
            console.log("Initialized level storage with default level 0");
        }
    }

    static getUnlockedLevel(): number {
        LevelManager.initLevelStorage();
        const levelStr = localStorage.getItem("level");
        if (levelStr) {
            const levelData = JSON.parse(levelStr);
            return levelData.unlockedLevel || 0;
        }
        return 0;
    }

    static unlockLevel(level: number) {
        LevelManager.initLevelStorage();
        const currentLevel = LevelManager.getUnlockedLevel();
        
        // Only update if the new level is higher
        if (level > currentLevel) {
            localStorage.setItem("level", JSON.stringify({ unlockedLevel: level }));
            console.log(`Unlocked level ${level}!`);
        }
    }

    static resetLevels() {
        localStorage.setItem("level", JSON.stringify({ unlockedLevel: 0 }));
        console.log("Levels reset to 0");
        
        // Reset cosmetics to none
        const cosmeticsStr = localStorage.getItem("cosmetics");
        if (cosmeticsStr) {
            const cosmetics = JSON.parse(cosmeticsStr);
            cosmetics.player1 = CosmeticType.None;
            cosmetics.player2 = CosmeticType.None;
            localStorage.setItem("cosmetics", JSON.stringify(cosmetics));
            console.log("Cosmetics reset to None");
        }
    }

    static isCosmeticUnlocked(cosmeticType: CosmeticType): boolean {
        const unlockedLevel = LevelManager.getUnlockedLevel();
        
        switch (cosmeticType) {
            case CosmeticType.None:
                return true; // Always unlocked
            case CosmeticType.Kid:
                return unlockedLevel >= 1;
            case CosmeticType.Drip:
                return unlockedLevel >= 2;
            case CosmeticType.Gold:
                return unlockedLevel >= 3;
            case CosmeticType.Crown:
                return unlockedLevel >= 4;
            default:
                return false;
        }
    }
}
