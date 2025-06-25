import { Actor, CollisionType, Vector, } from "excalibur";
import { Resources } from "../resources.ts";
import { Platform } from "./platform.ts";

/**
 * A platform that can move up and down between its original position and a maximum height.
 * Movement is controlled by external triggers through startElevating/stopElevating methods.
 * 
 * @param x - X coordinate in grid units (will be multiplied by 32)
 * @param y - Y coordinate in grid units (will be multiplied by 32)
 * @param width - Width of the platform actor
 * @param height - Height of the platform actor
 * @param playerNumber - Player type from PlatformType enum (determines sprite)
 * @param colliderWidth - Width of the collision box
 * @param colliderHeight - Height of the collision box
 * @param colliderOffset - Offset position of the collision box
 * @param maxHeight - Maximum Y height the elevator can reach (in pixels)
 */
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