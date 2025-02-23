import * as THREE from "three";
import { Water } from "three/addons/objects/Water2.js";

// based on https://threejs.org/examples/?q=water#webgl_water

export class Terra_Water {
    constructor() {
        this.water;
        this.waterConfig = {
            renderOrder: 40,
            width: 2000.0,
            height: 2000.0,
            x: 0,
            y: 0,
            z: 0,
        };
    }

    // Create Water Mesh
    createWater(scene, waterLevel) {
        const params = {
            color: "#caf0fe",
            scale: 2,
            flowX: 0.1,
            flowY: 0.1,
        };

        const waterGeometry = new THREE.PlaneGeometry(this.waterConfig.width, this.waterConfig.height);

        this.water = new Water(waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2(params.flowX, params.flowY),
            textureWidth: 1024,
            textureHeight: 1024,
            reflectivity: 0.75,
        });

        this.water.position.x = this.waterConfig.x;
        this.water.position.y = waterLevel;//this.waterConfig.y;
        this.water.position.z = this.waterConfig.z;

        this.water.rotation.x = -Math.PI / 2;

        this.water.renderOrder = this.waterConfig.renderOrder;
        return this.water;
    }

    update() {
        //this.water.position.y += 0.11;
        console.log(this.water.position.y)
        //this.water.rotation.y += 0.1;ddd
        //this.water.rotation.z += 0.1;
    }
}
