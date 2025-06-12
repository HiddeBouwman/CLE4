import { Camera, Actor, Vector, Scene } from "excalibur";

export class CameraController  {
    private camera: Camera;
    private scene: Scene;

    constructor(scene: Scene, camera: Camera) {
        this.scene = scene;
        this.camera = scene.camera;
    }


    update(player1?: Actor, player2?: Actor) {
        if (player1 && player2) {
            const mid = player1.pos.add(player2.pos).scale(0.5);
            this.camera.pos = mid;


            const distance = player1.pos.distance(player2.pos);
            const minZoom = 0.5;
            const maxZoom = 1.5;
            const baseDistance = 400; 
            let zoom = baseDistance / (distance + 1); 
            zoom = Math.max(minZoom, Math.min(maxZoom, zoom));
            this.camera.zoom = zoom;
        } else if (player1) {
            this.camera.strategy.elasticToActor(player1, 0.1, 0.05);
            this.camera.zoom = 1;
        }
    }
}