import { Actor, CollisionType, DegreeOfFreedom, Keys, Vector } from "excalibur";

export class Box extends Actor {
    constructor() {
        super({
            width: 100,
            height: 100,
            collisionType: CollisionType.Active
        });
        this.body.limitDegreeOfFreedom.push(DegreeOfFreedom.Rotation);
    }
}