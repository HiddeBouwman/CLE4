import { Actor, SpriteSheet, Animation, AnimationStrategy, Vector, CollisionType, Engine } from "excalibur";
import { Resources } from "../resources";
import { Player } from "../player";

export class Fire extends Actor {
    constructor(x: number, y: number) {
        super({
            width: 22,
            height: 32,
            collisionType: CollisionType.Fixed
        });
        this.pos = new Vector(x * 32, y * 32);

        // Maak een spritesheet en animatie
        const fireSheet = SpriteSheet.fromImageSource({
            image: Resources.Fire,
            grid: {
                rows: 12,
                columns: 1,
                spriteWidth: 32,
                spriteHeight: 32
            }
        });

        const fireAnim = Animation.fromSpriteSheet(
            fireSheet,
            Array.from({ length: 12 }, (_, i) => i), // frames 0 t/m 11
            100, // ms per frame
            AnimationStrategy.Loop
        );

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