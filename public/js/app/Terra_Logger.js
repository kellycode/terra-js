
// USES:
// NTS_UTIL

// USED IN:
// NTS_PLAYER_C
// NTS_WORLD_C

// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich


"use strict";

export class Terra_Logger {
    
    static visible = false;

    static setText (txt) {
        document.getElementById('logger').textContent = txt;
    };

    static  setHtml (html) {
        document.getElementById('logger').innerHTML = html;
    };

    static toggle () {
        const el = document.getElementById('logger');
        this.visible = !this.visible;
        if (this.visible) {
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'none';
        }
    };

    static hide () {
        document.getElementById('logger').style.display = 'none';
        this.visible = false;
    };

    static show () {
        document.getElementById('logger').style.display = 'inline-block';
        this.visible = true;
    };

    static isVisible () {
        return this.visible;
    }
};
