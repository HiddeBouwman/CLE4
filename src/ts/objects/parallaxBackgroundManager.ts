import { Actor, Engine, Vector, Scene, Camera, ImageSource } from "excalibur";
import { Resources } from "../resources";

interface ParallaxLayerConfig {
    image: ImageSource;
    speed: number; // 0 = stil, 1 = camera snelheid
    z: number; // render volgorde
}

export class ParallaxBackgroundManager {
    private layers: { actor: Actor; speed: number }[] = [];
    private camera: Camera;
    private engine: Engine;

    constructor(scene: Scene, camera: Camera, engine: Engine) {
        this.camera = camera;
        this.engine = engine;

        // Voeg lagen toe van achter naar voor
        this.addLayer(Resources.BackgroundSky, 0.0025, -5);
        this.addLayer(Resources.BackgroundBack, 0.0125, -4);
        this.addLayer(Resources.BackgroundThird, 0.025, -3);
        this.addLayer(Resources.BackgroundSecond, 0.0625, -2);
        this.addLayer(Resources.BackgroundFront, 0.125, -1);

        for (const { actor } of this.layers) {
            scene.add(actor);
        }
    }

    private addLayer(image: ImageSource, speed: number, z: number) {
        const actor = new Actor({
            pos: Vector.Zero,
            width: this.engine.drawWidth,
            height: this.engine.drawHeight,
            z,
            anchor: Vector.Half, // Midden als referentiepunt
        });
        actor.graphics.use(image.toSprite());
        this.layers.push({ actor, speed });
    }

    update() {
        const cam = this.camera;
        const screenCenter = new Vector(this.engine.drawWidth / 2, this.engine.drawHeight / 2);

        for (const { actor, speed } of this.layers) {
            // Alleen horizontale parallax, altijd gecentreerd op het scherm
            const offset = new Vector(-400, 150); // Pas eventueel aan
            const parallaxX = cam.pos.x * (1 - speed) + offset.x;
            const parallaxY = cam.pos.y * (1 - speed) + offset.y;

            actor.scale = Vector.One;
            actor.pos = new Vector(
                screenCenter.x + parallaxX,
                screenCenter.y + offset.y
            );
        }
    }
}