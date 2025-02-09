
// USES:
// -

// USED IN:
// NTS_APP_C
// NTS_LOGGER
// NTS_NOTIFICATION
// NTS_WORLD

// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

let NTS_UTIL = {
    docGetElById: function(id) {
        return document.getElementById(id);
    },

    detectWebGL: function() {
        try {
            var canvas = document.createElement('canvas');
            return (!!canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl'));
        } catch (e) {
            return null;
        }
    }
};

