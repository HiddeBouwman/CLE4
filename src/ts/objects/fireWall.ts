import { Actor, Engine, Vector } from "excalibur";
import { Fire } from "./fire";

// Plaats een muur van vuur tussen (startX, startY) en (endX, endY), elke 0.25 tile (8px)
export class FireWall extends Actor {
    constructor(startX: number, startY: number, endX: number, endY: number) {
        super();
        // Bepaal richting en afstand
        const start = new Vector(startX, startY);
        const end = new Vector(endX, endY);
        const delta = end.sub(start);
        const length = delta.magnitude; // GOED
        const steps = Math.floor(length / 0.25); // aantal kwart-tiles

        // Richtingsvector per stap (in grid tiles)
        const stepVec = delta.normalize().scale(0.25);

        for (let i = 0; i <= steps; i++) {
            const pos = start.add(stepVec.scale(i));
            // Maak een Fire op deze positie (let op: Fire verwacht grid-coördinaten)
            const fire = new Fire(pos.x, pos.y);
            this.addChild(fire);
        }
    }

    onInitialize(engine: Engine) {
        // Voeg alle vuur-actors toe aan de scene
        for (const child of this.children) {
            engine.add(child);
        }
    }
}