import { Actor, Vector, SpriteSheet, Animation, AnimationStrategy } from "excalibur";
import { Resources } from "../resources.ts";

/**
 * Visual indicator for portal exit locations.
 * Displays an animated portal effect without teleportation functionality.
 * 
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 */
export class PortalExit extends Actor {
    constructor(x: number, y: number) {
        super({
            width: 48,
            height: 48,
        });
        this.pos = new Vector(x, y);

        const portalExitSheet = SpriteSheet.fromImageSource({
            image: Resources.PortalExit,
            grid: {
                rows: 24,
                columns: 1,
                spriteWidth: 48,
                spriteHeight: 48
            }
        });

        const animatedPortalExit = Animation.fromSpriteSheet(
            portalExitSheet,
            Array.from({ length: 24 }, (_, i) => i),
            120
        );
        animatedPortalExit.strategy = AnimationStrategy.Loop;
        this.graphics.use(animatedPortalExit);
        this.scale = new Vector(2, 2);
    }
}