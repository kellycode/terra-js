// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

export class Terra_Input {
    static state = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0,
        pitchup: 0,
        pitchdown: 0,
    };

    static keyStates = [];
    static keyPressListeners = {};
    static wheelListeners = {};

    static initialized = false;

    static setState(k, s) {
        var cs = this.state;
        //console.log(k);
        // arrow keys L/R/F/B
        if (k === 37 || k === 65)
            // left arrow or a
            cs.left = s;
        else if (k === 39 || k === 68)
            // right arrow or d
            cs.right = s;
        else if (k === 38 || k === 87)
            // up arrow or w
            cs.forward = s;
        else if (k === 40 || k === 83)
            // down arrow or s
            cs.back = s;
        else if (k === 32)
            // space bar (far cry 4 buzzer)
            cs.up = s;
        else if (k === 67)
            // c key (far cry 4 buzzer)
            cs.down = s;
        // pitchup/down used in manual and fly modes
        else if (k === 81)
            // Q
            cs.pitchup = s;
        else if (k === 69)
            // E
            cs.pitchdown = s;
    }

    static onKeyDown(ev) {
        if (!this.keyStates[ev.keyCode]) {
            this.setState(ev.keyCode, 1.0);
            this.keyStates[ev.keyCode] = true;
            var codeStr = ev.keyCode.toString();
            if (typeof this.keyPressListeners[codeStr] === "function") {
                //console.log(codeStr);
                this.keyPressListeners[codeStr]();
            }
        }
    }

    static onKeyUp(ev) {
        if (this.keyStates[ev.keyCode]) {
            this.keyStates[ev.keyCode] = false;
            this.setState(ev.keyCode, 0.0);
        }
    }

    static onWheel(e) {
        let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
        for (const [key, value] of Object.entries(this.wheelListeners)) {
            this.wheelListeners[key](e, delta);
        }
    }

    static init() {
        if (this.initialized) {
            return;
        }
        document.addEventListener("keydown", this.onKeyDown.bind(this), true);
        document.addEventListener("keyup", this.onKeyUp.bind(this), true);
        document.addEventListener("wheel", this.onWheel.bind(this), true);
        document.addEventListener(
            "wheel",
            function (event) {
                if (event.ctrlKey) {
                    event.preventDefault();
                }
                this.onWheel;
            }.bind(this),
            { passive: false }
        );

        this.initialized = true;
    }

    static getKeyState(code) {
        return this.keyStates[code];
    }

    static setWheelListener(name, fn) {
        this.wheelListeners[name] = fn;
    }

    static setKeyPressListener(code, fn) {
        this.keyPressListeners[code.toString()] = fn;
    }
}
