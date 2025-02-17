// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

import { Terra_Math } from "./Terra_Math.js"
import { Terra_Vec } from "./Terra_Vec.js"
import { Terra_Input } from "./Terra_Input.js"
import { Terra_Heightfield } from "./Terra_Heightfield.js"

// Creates a Player instance
// (User first person camera)
export class Terra_Player {
    constructor(heightField, waterHeight, world) {
        this.HEIGHTFIELD = heightField;
        this.WATERHEIGHT = waterHeight;

        this.DEFAULT_HEIGHT = 0.0;
        this.MIN_HEIGHT = 2.5;
        this.MAX_HEIGHT = 275.0;
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
        this.MAN_VEL = 40.0;
        this.MAN_ZVEL = 10.0;
        this.MAN_YAWVEL = 0.5;
        this.MAN_PITCHVEL = 0.5;
        this.MAN_MAXPITCH = Math.PI / 4.0;
        this.MODE_MAN = 2;
        this.NUM_MODES = 3;

        this.drone;
        this.world = world;

        this.curT = 0;
        this.state = {
            pos: Terra_Vec.Vec3.create(0.0, 0.0, this.DEFAULT_HEIGHT),
            vel: Terra_Vec.Vec3.create(0.0, 0.0, 0.0),
            dir: Terra_Vec.Vec3.create(1.0, 0.0, 0.0),
            yaw: 0.0,
            yawVel: 0.0,
            pitch: 0.0,
            pitchVel: 0.0,
            roll: 0.0,
            rollVel: 0.0,
            floatHeight: 0.0,
        };

        title_bar_left

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
        // Calc cam look direction vector
        // doesn't effect anything
        var d = this.state.dir;
        d.z = Math.sin(this.state.pitch);
        var s = 1.0 - Math.abs(d.z);
        d.x = Math.cos(this.state.yaw) * s;
        d.y = Math.sin(this.state.yaw) * s;
    }
    
    // Manual movement
    updateManual(i, dt) {
        var ft = dt / 1000.0;
        this.state.yawVel = 0;

        if (i.left) {
            this.state.yawVel = this.MAN_YAWVEL;
        } else if (i.right) {
            this.state.yawVel = -this.MAN_YAWVEL;
        }

        this.state.yaw += this.state.yawVel * ft;
        this.state.pitchVel = 0;

        if (i.pitchup) {
            this.state.pitchVel = this.MAN_PITCHVEL;
        } else if (i.pitchdown) {
            this.state.pitchVel = -this.MAN_PITCHVEL;
        }

        this.state.pitch += this.state.pitchVel * ft;
        this.state.pitch = Terra_Math.clamp(this.state.pitch, -this.MAN_MAXPITCH, this.MAN_MAXPITCH);
        Terra_Vec.Vec3.set(this.state.vel, 0, 0, 0);

        if (i.forward) {
            this.state.vel.x = this.MAN_VEL * Math.cos(this.state.yaw);
            this.state.vel.y = this.MAN_VEL * Math.sin(this.state.yaw);
        } else if (i.back) {
            this.state.vel.x = -this.MAN_VEL * Math.cos(this.state.yaw);
            this.state.vel.y = -this.MAN_VEL * Math.sin(this.state.yaw);
        }

        this.state.pos.x += this.state.vel.x * ft;
        this.state.pos.y += this.state.vel.y * ft;

        if (i.up) {
            this.state.vel.z = this.MAN_ZVEL;
        } else if (i.down) {
            this.state.vel.z = -this.MAN_ZVEL;
        }

        this.state.pos.z += this.state.vel.z * ft;

        var groundHeight = Math.max(
            Terra_Heightfield.heightAt(this.HEIGHTFIELD, this.state.pos.x, this.state.pos.y, true),
            this.WATERHEIGHT
        );

        if (this.state.pos.z < groundHeight + this.MIN_HEIGHT) {
            this.state.pos.z = groundHeight + this.MIN_HEIGHT;
        } else if (this.state.pos.z > this.MAX_HEIGHT) {
            this.state.pos.z = this.MAX_HEIGHT;
        }
    }
}
