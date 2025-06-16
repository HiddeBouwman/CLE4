import { Actor, Engine, Vector, Scene, Camera, ImageSource } from "excalibur";
import { Resources } from "../resources";

export class ParallaxBackgroundManager {
    private layers: { actor: Actor; speed: number }[] = [];
    private camera: Camera;
    private engine: Engine;

    // A special bottom fill layer to extend the background vertically downward
    private bottomFill: Actor;
    private bottomFillSpeed = 0.125;
    private bottomFillZ = -1.5;
    private bottomFillMinY = -1112;

    constructor(scene: Scene, camera: Camera, engine: Engine) {
        this.camera = camera;
        this.engine = engine;

        // Add all parallax layers, from farthest back (sky) to nearest front
        // order = file name -> scroll speed -> z-axis -> mirrored
        this.addLayer(Resources.BackgroundSky, 0.0025, -5, true);
        this.addLayer(Resources.BackgroundBack, 0.0125, -4, false);
        this.addLayer(Resources.BackgroundThird, 0.025, -3, false);
        this.addLayer(Resources.BackgroundSecond, 0.0625, -2, false);
        this.addLayer(Resources.BackgroundFront, 0.125, -1, false);

        // Add all regular layers to the scene
        for (const { actor } of this.layers) {
            scene.add(actor);
        }

        // Add bottom fill as a horizontally repeated layer, but not part of this.layers
        this.bottomFill = this.addRepeatedLayer(Resources.BackgroundBottomFill, this.bottomFillZ);
        scene.add(this.bottomFill);
    }

    /**
     * Adds a new parallax background layer that is repeated horizontally or vertically.
     * Layers are stored internally and automatically updated.
     */
    private addLayer(
        image: ImageSource,
        speed: number,
        z: number,
        mirrorOdd = false, // doesn't need to exist anymore since the sky is a static image but i'm to lazy to change the code to remove it
        verticalRepeat = false
    ) {
        const layerContainer = new Actor({
            pos: Vector.Zero,
            z,
            width: this.engine.drawWidth,
            height: this.engine.drawHeight,
            anchor: Vector.Half,
        });

        const sprite = image.toSprite();
        const imageWidth = sprite.width;
        const imageHeight = sprite.height;

        // Determine how many times to repeat the sprite
        const repeatCount = verticalRepeat
            ? Math.ceil(this.engine.drawHeight / imageHeight) + 2 // number can be increased or decreased, depends on how big the levels will turn out.
            : Math.ceil(this.engine.drawWidth / imageWidth) + 2;

        for (let i = 0; i < repeatCount; i++) {
            const isMirrored = mirrorOdd && i % 2 === 1; // even repeated backgrounds get mirrored, was intended for the sky so it currently has no use.

            const pos = verticalRepeat // for the bottomFill layer.
                ? new Vector(0, i * imageHeight)
                : new Vector(i * imageWidth, 0);

            const part = new Actor({
                pos,
                width: imageWidth,
                height: imageHeight,
                anchor: isMirrored ? Vector.Right : Vector.Zero,
            });

            part.graphics.use(sprite);

            // Mirror horizontally if needed (e.g. for a sky gradient that tiles smoothly) (has no actual use)
            if (isMirrored) {
                part.scale = new Vector(-1, 1);
            }

            layerContainer.addChild(part);
        }

        // Store the layer for future updates
        this.layers.push({ actor: layerContainer, speed });
    }

    /**
     * Adds a horizontally repeated background layer without parallax speed tracking.
     * This is only used for the bottomFill layer, which is updated separately.
     */
    private addRepeatedLayer(image: ImageSource, z: number): Actor {
        const container = new Actor({
            pos: Vector.Zero,
            z,
            width: this.engine.drawWidth,
            height: this.engine.drawHeight,
            anchor: Vector.Half,
        });

        const sprite = image.toSprite();
        const imageWidth = sprite.width;

        const repeatCount = Math.ceil(this.engine.drawWidth / imageWidth) + 2;

        for (let i = 0; i < repeatCount; i++) {
            const part = new Actor({
                pos: new Vector(i * imageWidth, 0),
                width: imageWidth,
                height: sprite.height,
                anchor: Vector.Zero,
            });
            part.graphics.use(sprite);
            container.addChild(part);
        }

        return container;
    }


    /**
     * Updates the position of all parallax layers based on camera movement,
     * including special logic for the bottom fill layer.
     */
    update() {
        const cam = this.camera;
        const screenCenter = new Vector(this.engine.drawWidth / 2, this.engine.drawHeight / 2);

        const defaultOffset = new Vector(-1200, -600);

        // Update all standard parallax layers
        for (const { actor, speed } of this.layers) {
            const parallaxX = cam.pos.x * (1 - speed) + defaultOffset.x;

            let posY: number;
            if (speed === 0.0025) {
                // Sky layer follows camera Y exactly (hence why the mirroring thing has no use)
                posY = screenCenter.y + cam.pos.y + defaultOffset.y;
            } else {
                // Other layers use a reduced Y parallax to create depth
                posY = screenCenter.y + cam.pos.y * (0.9 - speed) + defaultOffset.y;
            }

            actor.scale = Vector.One;
            actor.pos = new Vector(screenCenter.x + parallaxX, posY);
        }

        // --- Special update logic for the bottom fill layer ---
        const speed = this.bottomFillSpeed;
        const offset = new Vector(-1200, -88); // Custom offset for bottomFill
        const parallaxX = cam.pos.x * (1 - speed) + offset.x;

        // Compute intended Y position based on parallax
        let desiredY = screenCenter.y + cam.pos.y * (0.9 - speed) + offset.y;

        // Prevent the bottom fill from moving above the min Y limit
        if (desiredY < this.bottomFillMinY) {
            desiredY = this.bottomFillMinY;
        }

        this.bottomFill.scale = Vector.One;
        this.bottomFill.pos = new Vector(screenCenter.x + parallaxX, desiredY);
    }
}