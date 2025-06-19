import { Actor, Vector, CollisionType, Engine } from "excalibur"
import { Resources } from '../resources'

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

    onPreUpdate(_engine: Engine, delta: number) {
        if (this.toggleInterval <= 0) return;

        this.timeElapsed += delta;

        if (this.timeElapsed >= this.toggleInterval && this.shouldRespawn) {
            this.shouldRespawn = false;
            console.log('Block disappearing');
            this.kill();

            // Create new block after half the interval
            const currentScene = this.scene;
            const pos = this.pos;
            const interval = this.toggleInterval;

            // Use engine's timer system instead of setTimeout
            _engine.clock.schedule(() => {
                if (currentScene) {
                    console.log('Block reappearing');
                    const newBlock = new Block(pos.x, pos.y, interval);
                    currentScene.add(newBlock);
                }
            }, this.toggleInterval / 2);
        }
    }
}