import { Actor, Vector, Shape, CompositeCollider, CollisionType } from "excalibur";
import { Resources } from "../resources";
import { ElevatorPlatform } from "./elevatorPlatform";
import { Player } from "../player";
import { Box } from "./box";

export class PressurePlate extends Actor {
    private targetPlatform: ElevatorPlatform;
    private plateSprite: Actor;
    private _activeCount = 0; // Tracks how many objects are on the plate

    constructor(x, y, targetPlatform: ElevatorPlatform) {
        super({
            width: 100,
            height: 100,
            collisionType: CollisionType.Fixed,
            z: 5 // Draw base in front
        });

        // Set the base sprite for the pressure plate
        this.graphics.use(Resources.pressurePlateBase.toSprite());
        this.pos = new Vector(x, y);

        // Add the green plate as a child actor (drawn behind the base)
        this.plateSprite = new Actor({
            pos: new Vector(0, 0),
            anchor: new Vector(0.5, 0.5),
            z: -5 // Draw behind the base
        });
        this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
        this.addChild(this.plateSprite);

        // Create a composite collider: box in the center, circles on the sides
        const composite = new CompositeCollider([
            Shape.Box(60, 12, Vector.Half, new Vector(0, 26)),
            Shape.Box(6, 6, new Vector(5.5, -4.5)),
            Shape.Box(6, 6, new Vector(-4.5, -4.5)),
        ]);
        this.collider.set(composite);

        this.targetPlatform = targetPlatform;
        this.addTag('ground'); // So players/boxes can stand on it
    }

    onInitialize(engine) {
        // When something starts colliding with the plate
        this.on("collisionstart", (evt) => {
            const other = evt.other.owner;
            // Only count players and boxes
            if (other && (other instanceof Player || other instanceof Box)) {
                this._activeCount++;
                // If this is the first object, activate the plate
                if (this._activeCount === 1) {
                    this.targetPlatform.startElevating();
                    this.plateSprite.graphics.use(Resources.PressurePlateGreenActivated.toSprite());
                }
            }
        });

        // When something stops colliding with the plate
        this.on("collisionend", (evt) => {
            const other = evt.other.owner;
            // Only count players and boxes
            if (other && (other instanceof Player || other instanceof Box)) {
                this._activeCount = Math.max(0, this._activeCount - 1);
                // If no objects remain, deactivate the plate
                if (this._activeCount === 0) {
                    this.targetPlatform.stopElevating();
                    this.plateSprite.graphics.use(Resources.PressurePlateGreen.toSprite());
                }
            }
        });
    }
}