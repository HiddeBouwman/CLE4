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

        // Stel gewenste collider-grootte in (bijvoorbeeld 100 breed, 8 hoog)
        const colliderWidth = width; // of bijvoorbeeld 100
        const colliderHeight = 8;

        // Plaats de collider onderaan de sprite
        const colliderOffset = new Vector(0, (height / 2) - (colliderHeight / 2));
        this.collider.useBoxCollider(colliderWidth, colliderHeight, colliderOffset);
    }
}