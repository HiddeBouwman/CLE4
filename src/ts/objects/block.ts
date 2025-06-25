import { Actor, Vector, CollisionType, Engine } from "excalibur"
import { Resources } from '../resources'
import { GhostBlock } from './ghostblock.ts'

/**
 * A block that can appear and disappear at regular intervals.
 * If toggleInterval is set, the block will disappear and reappear periodically.
 * 
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 * @param toggleInterval - Time interval in milliseconds for disappearing/reappearing (0 for static block)
 */
export class Block extends Actor {
    private timeElapsed: number = 0;
    private toggleInterval: number;
    private shouldRespawn: boolean = true;

    constructor(x: number, y: number, toggleInterval: number = 0) {
        super({
            width: Resources.Block.width,
            height: Resources.Block.height,
            pos: new Vector(x, y),
            collisionType: CollisionType.Fixed,
            anchor: new Vector(0, 0)
        })
        
        this.graphics.use(Resources.Block.toSprite())
        this.toggleInterval = toggleInterval
    }

    onPreUpdate(engine: Engine, delta: number) {
        if (this.toggleInterval <= 0) return;

        this.timeElapsed += delta;

        if (this.timeElapsed >= this.toggleInterval && this.shouldRespawn) {
            this.shouldRespawn = false;
            this.kill();

            const currentScene = this.scene;
            const pos = this.pos;
            const interval = this.toggleInterval;

            // Voeg een GhostBlock toe
            if (currentScene) {
                const ghost = new GhostBlock(pos.x, pos.y, this.width, this.height);
                currentScene.add(ghost);

                // Na de helft van het interval: verwijder ghost en voeg Block weer toe
                engine.clock.schedule(() => {
                    ghost.kill();
                    if (currentScene) {
                        const newBlock = new Block(pos.x, pos.y, interval);
                        currentScene.add(newBlock);
                    }
                }, this.toggleInterval / 2);
            }
        }
    }
}