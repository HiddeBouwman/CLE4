import { Actor, Vector, CollisionType } from "excalibur";
import { Resources } from "../resources";

export class GhostBlock extends Actor {
    constructor(x: number, y: number, width: number, height: number) {
        super({
            width,
            height,
            pos: new Vector(x, y),
            collisionType: CollisionType.Passive,
            anchor: new Vector(0, 0)
        });
        this.graphics.use(Resources.GhostBlock.toSprite());
    }
}