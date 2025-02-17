/*global THREE*/

// USES:
// THREE

// USED IN:
// NTS_WORLD_C

// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

let NTS_DRONE = {
    timer: 0,

    initDrone: function (world, assets) {
        let gltf = assets.models["drone"];
        let droneScene = gltf.scene;

        droneScene.rotation.x = Math.PI / 2;
        droneScene.rotation.y = -Math.PI / 2;
        droneScene.scale.set(10, 10, 10);

        world.droneHolder = new THREE.Object3D();
        world.droneHolder.rotation.order = "ZYX";
        world.droneHolder.position.set(10, 0, 110);

        world.droneHolder.add(droneScene);

        world.scene.add(world.droneHolder);

        world.drone = gltf;

        world.drone.userData.clock = new THREE.Clock();

        this.droneMixer = new THREE.AnimationMixer(gltf.scene);

        const animations = gltf.animations;
        if (animations && animations.length > 0) {
            const animation = animations[0];
            this.droneMixer.clipAction(animation).play();
        }

        world.droneHolder.add(world.camHolder);

        const light = new THREE.AmbientLight(0xffffff); // soft white light
        world.scene.add(light);
    },

    updateDrone: function (world, ppos, pyaw, ppitch, proll) {
        world.camHolder.position.x = world.cameraPosition.x;
        world.camHolder.position.y = world.cameraPosition.y;
        world.camHolder.position.z = world.cameraPosition.z;
        world.camHolder.rotation.y = world.cameraPosition.r;

        world.droneHolder.position.x = ppos.x;
        world.droneHolder.position.y = ppos.y;
        world.droneHolder.position.z = ppos.z;

        // this.timer++;

        // if(this.timer > 100) {
        //     console.log(ppos);
        //     this.timer = 0;
        // }

        world.droneHolder.rotation.z = pyaw;
        world.droneHolder.rotation.y = 0;//-ppitch;
        world.droneHolder.rotation.x = 0;//proll;

        let delta = world.drone.userData.clock.getDelta();

        if (this.droneMixer) {
            this.droneMixer.update(delta);
        }
    },
};
