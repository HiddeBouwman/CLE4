import { Actor, CollisionType, Vector, } from "excalibur";
import { Resources } from "../resources.ts";
import { Platform } from "./platform.ts";

export class ElevatorPlatform extends Platform {

    private elevating: boolean = false;
    private originalY: number;
    private maxHeight: number;


    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        playerNumber: number,
        colliderWidth: number,
        colliderHeight: number,
        colliderOffset: Vector,
        maxHeight: number 
    ) {
        super(x, y, width, height, playerNumber, colliderWidth, colliderHeight, colliderOffset);
        this.originalY = y;
        this.maxHeight = maxHeight;
    }

    startElevating() {
        this.elevating = true;
    }

    stopElevating() {
        this.elevating = false;
    }


    onPreUpdate(engine, delta) {
        if (this.elevating && this.pos.y > this.maxHeight) {
            this.pos.y -= 1; // go up
            if (this.pos.y < this.maxHeight) {
                this.pos.y = this.maxHeight; // no further than max height
            }
        } else if (!this.elevating && this.pos.y < this.originalY) {
            this.pos.y += 1; // go down
            if (this.pos.y > this.originalY) {
                this.pos.y = this.originalY; // no further than original position
            }
        }
    }

}