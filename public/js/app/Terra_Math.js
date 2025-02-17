// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

export class Terra_Math {

    static PI2 = Math.PI * 2.0;

    static sign (n) {
        return (n > 0 ? 1 : n < 0 ? -1 : 0);
    }

    static roundFrac(n, places) {
        //console.log(Terra_Math.PI2);
        let d = Math.pow(10, places);
        return Math.round((n + 0.000000001) * d) / d;
    }

    static clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }

    static pmod(n, m) {
        return ((n % m + m) % m);
    }

    static nrand() {
        return Math.random() * 2.0 - 1.0;
    }

    static angle(x, y) {
        return Terra_Math.pmod(Math.atan2(y, x), Terra_Math.PI2);
    }

    static difAngle(a0, a1) {
        let r = Terra_Math.pmod(a1, Terra_Math.PI2) - Terra_Math.pmod(a0, Terra_Math.PI2);
        return Math.abs(r) < Math.PI ? r : r - Terra_Math.PI2 * Terra_Math.sign(r);
    }

    static dot(x0, y0, x1, y1) {
        return (x0 * x1 + y0 * y1);
    }
};
