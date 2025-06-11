import { Actor, Vector, CollisionType } from "excalibur"
import { Resources } from './resources.ts'

export class Floor extends Actor {

    //constructor for floor (default features)
    constructor(x, y) {
        super({ width: Resources.Floor.width, height: Resources.Floor.height })
        this.graphics.use(Resources.Floor.toSprite())
        this.pos = new Vector(x, y)
        this.body.collisionType = CollisionType.Fixed
    }
}