/*global THREE*/

// USES:
// THREE

// USED IN:
// NTS_WORLD_C

// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

let NTS_TREES = {
    treeScene: {},
    timer: 0,
    emissives: {
        e01: '#250C00',
        e02: '#622000'
    },
    
    initTrees: function (world, assets) {
        let x = 417;
        let y = -113;
        let scale = 1;

        let gltf = assets.models["tree"];
        this.treeScene = gltf.scene;

        this.treeScene.children[0].children[1].material.emissive = new THREE.Color( '#622000');

        this.treeScene.rotation.x = Math.PI / 2;
        this.treeScene.rotation.y = -Math.PI / 2;
        this.treeScene.scale.set(scale, scale, scale);

        var groundHeight = world.player.getHeightAt(x, y);

        this.treeScene.position.x = 417;
        this.treeScene.position.y = -113;
        this.treeScene.position.z = groundHeight;

        world.scene.add(this.treeScene);
    },

    updateTrees: function (x, y) {
        //this.treeScene.position.x = x;
        //this.treeScene.position.y = y;

        // this.timer++;

        // if(this.timer > 100) {
        //     console.log(this.treeScene.position.x, this.treeScene.position.y, this.treeScene.position.z);
        //     this.timer = 0;
        // }
    },
};
