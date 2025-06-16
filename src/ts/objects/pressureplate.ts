import { Actor, Vector, Shape, CompositeCollider, CollisionType, PolygonCollider } from "excalibur";
import { Resources } from "../resources";
import { ElevatorPlatform } from "./elevatorPlatform";
import { Player } from "../player";
import { Box } from "./box";

// These are for the polygon collisionboxes. 
const points1 = [
  new Vector(-36, 31),
  new Vector(-32, 31),
  new Vector(-32, 24)
];

const rampCollider1 = new PolygonCollider({
  points: points1
});

const points2 = [
    new Vector(36, 31),
    new Vector(32, 31),
    new Vector(32, 24)
];

const rampCollider2 = new PolygonCollider({
    points: points2
});



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
            rampCollider1,
            rampCollider2
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