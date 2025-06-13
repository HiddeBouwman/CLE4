import { Actor, CollisionType, Vector, } from "excalibur";
import { Resources } from "../resources.ts";
import { Platform } from "./platform.ts";

export class ElevatorPlatform extends Platform {

    private elevating: boolean = false;

    startElevating() {
        this.elevating = true;
    }

    stopElevating() {
        this.elevating = false;
    }

    onPreUpdate(engine, delta) {
        if (this.elevating) {
            this.pos.y -= 1; // Move up, adjust speed as needed
        }
    }

}