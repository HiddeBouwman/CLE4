import { Actor, CollisionType, Sprite, Vector } from "excalibur";
import { Resources } from "./resources";
type localStorageCosmetics = {
    player1: string,
    player2: string
}

export class Cosmetic extends Actor {
    playerNumber: number;
    curentCosmetic: Sprite[];
    cosmetics: object;
    constructor(playerNumber: number) {
        super({
            width: 1,
            height: 1,
            collisionType: CollisionType.PreventCollision,
        });
        this.playerNumber = playerNumber;
        this.scale = new Vector(2, 2);
        this.cosmetics = {
            drip: {
                spriteIdle: new Sprite({
                    image: Resources.Cosmetics,
                    sourceView: {
                        x: 32 * 0,
                        y: 32 * 0,
                        width: 32,
                        height: 32,
                    },
                }),
                spriteWalk: new Sprite({
                    image: Resources.Cosmetics,
                    sourceView: {
                        x: 32 * 1,
                        y: 32 * 1,
                        width: 32,
                        height: 32,
                    },
                }),
            },
        };

        this.curentCosmetic = this.getLocalStorage();
        this.graphics.use(this.curentCosmetic[0]);
    }
    getLocalStorage() {
        const selectedCosmetic = localStorage.getItem("cosmetics");
        return this.cosmetics[selectedCosmetic];
    }
    switchCosmetic(player: number, key: string) {
        let curentlocalStorage = localStorage.getItem("cosmetic");
        const selectedCosmetic = localStorage.setItem(
            "cosmetics",
            selectedCosmetics,
        );
    }
}
