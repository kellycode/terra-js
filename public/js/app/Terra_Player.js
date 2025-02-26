// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

import * as THREE from "three";
import { Terra_Vec } from "./Terra_Vec.js"
import { Terra_Input } from "./Terra_Input.js"

// Creates a Player instance
// (User first person camera)
export class Terra_Player {
    constructor(heightField, waterHeight, world) {
        this.HEIGHTFIELD = heightField;
        this.WATERHEIGHT = waterHeight;

        this.DEFAULT_HEIGHT = 0.0;
        this.MIN_HEIGHT = -20;
        this.MAX_HEIGHT = 300.0;
        this.FLOAT_VEL = 0.75;
        this.BOB_RANGE = 16.0;
        this.DEFAULT_PITCH = -0.325;
        this.MOVE_RANGE = 1500.0;
        this.ACCEL = 90.0; // forward accel
        this.DRAG = 0.1;
        this.VACCEL = 60.0; // vertical accel
        this.VDRAG = 5.0;
        this.YAW_ACCEL = 4.0; // angular accel (yaw)
        this.YAW_DRAG = 2.0;
        this.PITCH_ACCEL = 4.0;
        this.PITCH_RESIST = 16.0;
        this.PITCH_FRIC = 8.0;
        this.ROLL_ACCEL = 2.0;
        this.ROLL_RESIST = 10.0;
        this.ROLL_FRIC = 8.0;
        this.MAN_VEL = 100.0;
        this.MAN_ZVEL = 50.0;
        this.MAN_YAWVEL = 0.5;
        this.MAN_PITCHVEL = 1.0;
        this.MAN_MAXPITCH = Math.PI / 4.0;
        this.MODE_MAN = 2;
        this.NUM_MODES = 3;

        this.drone;
        this.world = world;

        this.curT = 0;
        this.state = {
            pos: Terra_Vec.Vec3.create(0.0, 100, 0.0),
            vel: Terra_Vec.Vec3.create(0.0, 0.0, 0.0),
            dir: Terra_Vec.Vec3.create(1.0, 0.0, 0.0),
            yaw: 0.0,
            pitch: 0.0,
            pitchVel: 0.0,
            roll: 0.0,
            rollVel: 0.0,
            floatHeight: 0.0,
            // replaced pitch
            yaw: 0.0,

            pitch: 0.0
        };

        this.raycaster = new THREE.Raycaster();
        this.DOWN_VECTOR = new THREE.Vector3(0, -1, 0);
        this.RAYCASTER_HEIGHT = 100;
        this.groundHeight;

        this.setModeText = function(mode) {
            document.getElementById("title_bar_left").textContent = mode;
        }

        //let autoplay = true
        this.mode = this.MODE_MAN;
        this.setModeText('Manual Mode');

        // scratchpad vectors
        this._a = Terra_Vec.Vec3.create();
        this._d = Terra_Vec.Vec3.create();
        this._p1 = Terra_Vec.Vec3.create();
        this._p2 = Terra_Vec.Vec3.create();
        this._p3 = Terra_Vec.Vec3.create();
    }

    // @param dt Delta time in ms
    update(dt) {
        this.curT += dt;
        this.updateManual(Terra_Input.state, dt);
    }
    
    // Manual movement
    updateManual(input, dt) {
        let ft = dt / 1000.0;
        let fts = dt / 500.0;
        let maxPitch = 0.3;


        if (input.left) { // A
            this.state.yaw -= this.MAN_PITCHVEL * ft;
        } else if (input.right) { // D
            this.state.yaw += this.MAN_PITCHVEL * ft;
        }

        if (input.pitchup) { // Q
            if(this.state.pitch < maxPitch) {
                this.state.pitch += this.MAN_PITCHVEL * ft;
            }
        } else if (input.pitchdown) { // E
            if(this.state.pitch > -maxPitch) {
                this.state.pitch -= this.MAN_PITCHVEL * ft;
            }
        }

        if (input.forward) { // W
            this.state.pos.z -= this.MAN_VEL * Math.cos(-this.state.yaw) * ft;
            this.state.pos.x -= this.MAN_VEL * Math.sin(-this.state.yaw) * ft;
        } else if (input.back) { // S
            this.state.pos.z += this.MAN_VEL * Math.cos(-this.state.yaw) * ft;
            this.state.pos.x += this.MAN_VEL * Math.sin(-this.state.yaw) * ft;
        }

        if (input.up) { // space bar
            this.state.pos.y += this.MAN_ZVEL * ft;
        } else if (input.down) { // C
            this.state.pos.y -= this.MAN_ZVEL * ft;
        }

        let castFrom = new THREE.Vector3(this.state.pos.x, this.state.pos.y + 100, this.state.pos.z);
        this.raycaster.set(castFrom, this.DOWN_VECTOR);
        let intersects = this.raycaster.intersectObject(this.world.terrainBody.GROUND_DATA.MESH);

        if (intersects.length > 0) {
            if(intersects[0].object.name === "fake_ground") {
                 this.groundHeight = intersects[0].point.y;
                //this.state.pos.y = groundHeight + 10;
            }
        }

        if (this.state.pos.y < this.MIN_HEIGHT) {
            this.state.pos.y = this.MIN_HEIGHT;
        } else if (this.state.pos.y > this.MAX_HEIGHT) {
            this.state.pos.y = this.MAX_HEIGHT;
        } else {
            //this.state.pos.y =  this.groundHeight + 10;
        }
    }
}
