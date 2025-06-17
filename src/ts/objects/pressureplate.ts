import { Actor, Vector, Shape, CompositeCollider, CollisionType, PolygonCollider } from "excalibur";
import { Resources } from "../resources";
import { IMovablePlatform } from "./platform";
import { Box } from "./box";
import { Player } from "../player";

export class PressurePlate extends Actor {
    protected targetPlatform: IMovablePlatform;
    protected plateSprite: Actor;
    protected _activeCount = 0;

    constructor(x: number, y: number, targetPlatform: IMovablePlatform, sprite) {
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

        // Polygons for hitbox
        const points1 = [
            new Vector(-32, 32),
            new Vector(-24, 32),
            new Vector(-24, 20)
        ];
        const rampCollider1 = new PolygonCollider({ points: points1 });

        const points2 = [
            new Vector(32, 32),
            new Vector(24, 32),
            new Vector(24, 20)
        ];
        const rampCollider2 = new PolygonCollider({ points: points2 });

        const composite = new CompositeCollider([
            Shape.Box(48, 12, Vector.Half, new Vector(0, 26)),
            rampCollider1,
            rampCollider2
        ]);
        this.collider.set(composite);

        this.targetPlatform = targetPlatform;
        this.addTag('ground');
    }
}