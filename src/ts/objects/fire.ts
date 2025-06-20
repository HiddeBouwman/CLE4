import { Actor, SpriteSheet, Animation, AnimationStrategy, Vector, CollisionType, Engine } from "excalibur";
import { Resources } from "../resources";
import { Player } from "../player";
import { CollisionGroup } from "../collision.ts";

type FireDirection = "up" | "down" | "left" | "right";

export class Fire extends Actor {
    constructor(x: number, y: number, direction: FireDirection = "up") {
        super({
            width: 32,
            height: 32,
            collisionType: CollisionType.Passive,
            collisionGroup: CollisionGroup.Fire
        });
        this.pos = new Vector(x * 32, y * 32);

        let fireSheet, flipHorizontal = false, flipVertical = false;

        if (direction === "up" || direction === "down") {
            fireSheet = SpriteSheet.fromImageSource({
                image: Resources.Fire,
                grid: { rows: 12, columns: 1, spriteWidth: 32, spriteHeight: 32 }
            });
            if (direction === "down") flipVertical = true;
        } else {
            fireSheet = SpriteSheet.fromImageSource({
                image: Resources.FireHorizontal,
                grid: { rows: 12, columns: 1, spriteWidth: 32, spriteHeight: 32 }
            });
            if (direction === "left") flipHorizontal = true;
        }

        const fireAnim = Animation.fromSpriteSheet(
            fireSheet,
            Array.from({ length: 12 }, (_, i) => i),
            20,
            AnimationStrategy.Loop
        );
        fireAnim.flipHorizontal = flipHorizontal;
        fireAnim.flipVertical = flipVertical;

        this.graphics.use(fireAnim);
    }

    onInitialize(engine: Engine) {
        this.on("collisionstart", (evt) => {
            if (evt.other.owner instanceof Player) {
                evt.other.owner.die(engine);
            }
        });
    }
}