import { Actor, Vector, Shape, CollisionType } from "excalibur";
import { Resources } from "../resources";

/**
 * Base class for all pressure plates.
 * Provides basic collision detection and visual representation.
 * Extended by specific pressure plate types with different behaviors.
 *
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 * @param velocityBoost - Amount of vertical velocity boost (used by some subclasses)
 * @param sprite - Base sprite for the pressure plate
 */
export class PressurePlate extends Actor {
    protected plateSprite: Actor;
    protected _activeCount = 0;
    public velocityBoost = 0;

    constructor(x: number, y: number, velocityBoost: number, sprite) {
        super({
            width: 100,
            height: 100,
            collisionType: CollisionType.Fixed,
            z: 5
        });

        if (sprite) {
            this.graphics.use(sprite);
        }
        this.pos = new Vector(x, y);

        this.plateSprite = new Actor({
            pos: new Vector(0, 0),
            anchor: new Vector(0.5, 0.5),
            z: -5
        });
        this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
        this.addChild(this.plateSprite);

        // Alleen een simpele box-collider, geen composite/polygonen meer!
        const boxCollider = Shape.Box(56, 1, Vector.Half, new Vector(0, 21));
        (boxCollider as any).activator = true; // custom property voor activatie
        this.collider.set(boxCollider);

        this.addTag('ground');
        this.addTag('pressureplate');
    }
}