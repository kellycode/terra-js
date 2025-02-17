// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

// simply used when the fullscreen button is
// clicked but not used in normal F11 fullscreen

export class Terra_Fullscreen {

    static toggle (el) {
        if (!this.is()) {
            if (el.requestFullscreen) {
                el.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    static is () {
        return !!document.fullscreenElement || !!document.mozFullScreenElement ||
              !!document.webkitFullscreenElement || !!document.msFullscreenElement;
    };
};