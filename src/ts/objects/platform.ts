import { Actor, CollisionType, Vector, Shape, Color } from "excalibur";
import { Resources } from "../resources.ts";

export class Platform extends Actor {
    playerNumber: number; // 1 of 2

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        playerNumber: number,
        colliderWidth: number,
        colliderHeight: number,
        colliderOffset: Vector
    ) {
        super({
            width,
            height,
            collisionType: CollisionType.Fixed
        });

        
        this.collider.useBoxCollider(colliderWidth, colliderHeight, colliderOffset);
        this.playerNumber = playerNumber;
        this.pos = new Vector(x, y);
        this.addTag('ground');

        // kies sprite of kleur op basis van speler
        if (playerNumber === 1) {
            this.graphics.use(Resources.Platform.toSprite());
        } else {
            // bijvoorbeeld een andere sprite of een tint
            const sprite = Resources.Platform.toSprite();
            sprite.tint = Color.Black;
            this.graphics.use(sprite);
        }

    }
}