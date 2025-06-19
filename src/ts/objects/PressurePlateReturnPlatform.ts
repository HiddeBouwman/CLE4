import { Platform, PlatformType, isBoostPlatformForPlayer, IMovablePlatform } from "./platform.ts";
import { Vector } from "excalibur";

export class PressurePlateReturnPlatform extends Platform implements IMovablePlatform {
    start: Vector;
    end: Vector;
    speed: number;
    private _pressureActive: boolean = false;
    private _activePressurePlates: number = 0;
    private _atTarget: boolean = true;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        platformType: PlatformType,
        colliderWidth: number,
        colliderHeight: number,
        colliderOffset: Vector,
        startPos: Vector,
        endPos: Vector,
        speed: number = 100,
        boostForPlayers: number[] = [],
        spriteScale: Vector = new Vector(1, 1)
    ) {
        super(x, y, width, height, platformType, colliderWidth, colliderHeight, colliderOffset, spriteScale, boostForPlayers);
        this.start = new Vector(startPos.x * 32, startPos.y * 32);
        this.end = new Vector(endPos.x * 32, endPos.y * 32);
        this.speed = speed;
    }

    registerPressurePlateActivated() {
        this._activePressurePlates++;
        this._pressureActive = true;
    }

    registerPressurePlateDeactivated() {
        this._activePressurePlates = Math.max(0, this._activePressurePlates - 1);
        if (this._activePressurePlates === 0) {
            this._pressureActive = false;
        }
    }

    onPreUpdate(engine, delta) {
        let target = this._pressureActive ? this.end : this.start;
        let wasAtTarget = this._atTarget;
        this._atTarget = this.pos.equals(target);

        if (!this._atTarget) {
            this.moveToTarget(target, delta);
        }
        this.currentDelta = this.pos.sub(this._lastPos);
        super.onPreUpdate(engine, delta);
    }

    private moveToTarget(target: Vector, delta: number) {
        const moveVec = target.sub(this.pos);
        const distance = moveVec.magnitude;
        if (distance < 1) {
            this.pos = target.clone();
            return;
        }
        const moveStep = moveVec.normalize().scale(this.speed * (delta / 1000));
        if (moveStep.magnitude > distance) {
            this.pos = target.clone();
        } else {
            this.pos = this.pos.add(moveStep);
        }
    }

    startMoving(): void {
        // Optioneel: je kunt hier logica toevoegen als je wilt
    }

    stopMoving(): void {
        // Optioneel: je kunt hier logica toevoegen als je wilt
    }
}