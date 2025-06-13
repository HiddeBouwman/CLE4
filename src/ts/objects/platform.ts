import { Actor, CollisionType, Vector, Shape, Color } from "excalibur";
import { Resources } from "../resources.ts";

export class Platform extends Actor {
    playerNumber: number; // 1 of 2

    constructor(x: number, y: number, width: number, height: number, playerNumber: number) {
        super({
            width: width,
            height: height,
            collisionType: CollisionType.Fixed
        });

        this.playerNumber = playerNumber;
        this.pos = new Vector(x, y);

        // kies sprite of kleur op basis van speler
        if (playerNumber === 1) {
            this.graphics.use(Resources.Platform.toSprite());
        } else {
            // bijvoorbeeld een andere sprite of een tint
            const sprite = Resources.Platform.toSprite();
            sprite.tint = Color.Black; 
            this.graphics.use(sprite);
        }

        // custom collider
        const colliderHeight = height - 8;
        const colliderOffset = new Vector(0, 4);
        const box = Shape.Box(width, colliderHeight, colliderOffset);
        this.collider.set(box);
    }
}