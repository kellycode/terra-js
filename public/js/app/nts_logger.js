
// USES:
// NTS_UTIL

// USED IN:
// NTS_PLAYER_C
// NTS_WORLD_C

// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich


"use strict";

let NTS_LOGGER = {
    
    visible: false,

    setText: function (txt) {
        NTS_UTIL.docGetElById('logger').textContent = txt;
    },

    setHtml: function (html) {
        NTS_UTIL.docGetElById('logger').innerHTML = html;
    },

    toggle: function () {
        const el = NTS_UTIL.docGetElById('logger');
        this.visible = !this.visible;
        if (this.visible) {
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'none';
        }
    },

    hide: function () {
        NTS_UTIL.docGetElById('logger').style.display = 'none';
        this.visible = false;
    },

    show: function () {
        NTS_UTIL.docGetElById('logger').style.display = 'inline-block';
        this.visible = true;
    },

    isVisible: function () {
        return this.visible;
    }
};
