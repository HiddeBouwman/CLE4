import { Actor, CollisionType, Vector, Shape } from "excalibur";
import { Resources } from "../resources.ts";

export class Platform extends Actor {
    constructor(x: number, y: number, width: number, height: number) {
        super({
            width: width,
            height: height,
            collisionType: CollisionType.Fixed
        });
        this.graphics.use(Resources.Platform.toSprite());
        this.pos = new Vector(x, y);

        // Maak een custom collider, bijvoorbeeld 8px naar beneden en iets kleiner
        const colliderHeight = height - 8; // bijvoorbeeld 8px minder hoog
        const colliderOffset = new Vector(0, 4); // 4px naar beneden (pas aan naar wens)
        const box = Shape.Box(width, colliderHeight, colliderOffset);
        this.collider.set(box);
    }
}