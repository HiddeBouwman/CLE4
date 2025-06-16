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

        // different sprite for each player
        if (playerNumber === 1) {
            this.graphics.use(Resources.Platform.toSprite());
        } else {
            // different sprite for player 2
            const sprite = Resources.Platform.toSprite();
            sprite.tint = Color.Black; 
            this.graphics.use(sprite);
        }

    }
}