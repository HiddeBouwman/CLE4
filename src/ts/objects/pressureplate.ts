import { Actor, Vector, Shape, CompositeCollider, CollisionType, PolygonCollider } from "excalibur";
import { Resources } from "../resources";
import { Player } from "../player";
import { Box } from "./box";
import { IMovablePlatform } from "./platform";

export class PressurePlate extends Actor {
    private targetPlatform: IMovablePlatform;
    private plateSprite: Actor;
    private _activeCount = 0;

    constructor(x, y, targetPlatform: IMovablePlatform) {
        super({
            width: 100,
            height: 100,
            collisionType: CollisionType.Fixed,
            z: 5
        });

        // Set the base sprite for the pressure plate
        this.graphics.use(Resources.pressurePlateBase.toSprite());
        this.pos = new Vector(x, y);

        // Add the green plate as a child actor (drawn behind the base)
        this.plateSprite = new Actor({
            pos: new Vector(0, 0),
            anchor: new Vector(0.5, 0.5),
            z: -5
        });
        this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
        this.addChild(this.plateSprite);

        // Polygons
        const points1 = [
            new Vector(-32, 32),
            new Vector(-24, 32),
            new Vector(-24, 20)
        ];
        const rampCollider1 = new PolygonCollider({
            points: points1
        });

        const points2 = [
            new Vector(32, 32),
            new Vector(24, 32),
            new Vector(24, 20)
        ];
        const rampCollider2 = new PolygonCollider({
            points: points2
        });

        // Create a composite collider: box in the center, polygons on the sides
        const composite = new CompositeCollider([
            Shape.Box(48, 12, Vector.Half, new Vector(0, 26)),
            rampCollider1,
            rampCollider2
        ]);
        this.collider.set(composite);

        this.targetPlatform = targetPlatform;
        this.addTag('ground');
    }

    onInitialize(engine) {
        // When something starts colliding with the plate
        this.on("collisionstart", (evt) => {
            const other = evt.other.owner;
            if (other && (other instanceof Player || other instanceof Box)) {
                this._activeCount++;
                if (this._activeCount === 1) {
                    // Use new method for multi-plate support
                    if (typeof this.targetPlatform.registerPressurePlateActivated === "function") {
                        this.targetPlatform.registerPressurePlateActivated();
                    } else {
                        this.targetPlatform.startMoving();
                    }
                    this.plateSprite.graphics.use(Resources.PressurePlateGreenActivated.toSprite());
                }
            }
        });

        // When something stops colliding with the plate
        this.on("collisionend", (evt) => {
            const other = evt.other.owner;
            if (other && (other instanceof Player || other instanceof Box)) {
                this._activeCount = Math.max(0, this._activeCount - 1);
                if (this._activeCount === 0) {
                    // Use new method for multi-plate support
                    if (typeof this.targetPlatform.registerPressurePlateDeactivated === "function") {
                        this.targetPlatform.registerPressurePlateDeactivated();
                    } else {
                        this.targetPlatform.stopMoving();
                    }
                    this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
                }
            }
        });
    }
}