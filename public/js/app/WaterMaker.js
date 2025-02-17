import * as THREE from "three";
import { Water } from "three/addons/objects/Water2.js";

export class WaterMaker {
    constructor() {}

    // Create Water Mesh
    createWater(scene) {
        let water;

        const params = {
            color: "#ffffff",
            scale: 4,
            flowX: 1,
            flowY: 1,
        };

        const waterGeometry = new THREE.PlaneGeometry(20, 20);

        water = new Water(waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2(params.flowX, params.flowY),
            textureWidth: 1024,
            textureHeight: 1024,
        });

        water.position.y = 1;
        water.rotation.x = Math.PI * -0.5;
        scene.add(water);
    }
}
