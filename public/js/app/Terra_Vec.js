
// USES:
// -

// USED IN:
// NTS_GRASS
// NTS_HEIGHTFIELD
// NTS_PLAYER_C
// NTS_TERRAIN
// NTS_TERRAMAP
// NTS_VEC
// NTS_WATER
// NTS_WORLD_C

// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich


"use strict";

// Vector Math with library-agnostic interface types.
// i.e. Any object with matching property names will work,

// 3D VECTOR FUNCTIONS



export class Terra_Vec {

    static Vec2 = {
        create(x, y) {
            return {
                x: (typeof x === 'number') ? x : 0.0,
                y: (typeof y === 'number') ? y : 0.0
            };
        },

        clone(v) {
            return Terra_Vec.Vec2.create(v.x, v.y);
        },

        set(v, x, y) {
            v.x = x;
            v.y = y;
        },

        copy (src, out) {
            out.x = src.x;
            out.y = src.y;
        },

        length (v) {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        },

        setLength (v, l, out) {
            var s = Terra_Vec.Vec2.length(v);
            if (s > 0.0) {
                s = l / s;
                out.x = v.x * s;
                out.y = v.y * s;
            } else {
                out.x = l;
                out.y = 0.0;
            }
        },

        dist (v0, v1) {
            var dx = v1.x - v0.x;
            var dy = v1.y - v0.y;
            return Math.sqrt(dx * dx + dy * dy);
        },

        normalize (v, out) {
            Terra_Vec.Vec2.setLength(v, 1.0, out);
        },

        dot (v0, v1) {
            return (v0.x * v1.x + v0.y * v1.y);
        },

        det (v0, v1) {
            return (v0.x * v1.y - v0.y * v1.x);
        },

        // Rotate v by r radians, result in out.
        // (v and out can reference the same Vec2 object)
        rotate (v, r, out) {
            var c = Math.cos(r), s = Math.sin(r), x = v.x, y = v.y;
            out.x = x * c - y * s;
            out.y = x * s + y * c;
        },
        
        // Uses pre-computed cos & sin values of rotation angle
        rotateCS (v, c, s, out) {
            var x = v.x, y = v.y;
            out.x = x * c - y * s;
            out.y = x * s + y * c;
        },

        // nx,ny should be normalized; vx,vy length will be preserved
        reflect (v, n, out) {
            var d = Terra_Vec.Vec2.dot(n, v);
            out.x = v.x - 2.0 * d * n.x;
            out.y = v.y - 2.0 * d * n.y;
        },

        toArray (v) {
            return [v.x, v.y];
        }
    }

    // 3D VECTOR FUNCTIONS

    static Vec3 = {
        create (x, y, z) {
            return {
                x: (typeof x === 'number') ? x : 0.0,
                y: (typeof y === 'number') ? y : 0.0,
                z: (typeof z === 'number') ? z : 0.0
            };
        },

        clone (v) {
            return Terra_Vec.Vec3.create(v.x, v.y, v.z);
        },

        set (v, x, y, z) {
            v.x = x;
            v.y = y;
            v.z = z;
        },

        copy (src, out) {
            out.x = src.x;
            out.y = src.y;
            out.z = src.z;
        },

        length (v) {
            return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        },

        setLength (v, l, out) {
            var s = Terra_Vec.Vec3.length(v);
            if (s > 0.0) {
                s = l / s;
                out.x = v.x * s;
                out.y = v.y * s;
                out.z = v.z * s;
            } else {
                out.x = l;
                out.y = 0.0;
                out.z = 0.0;
            }
        },

        dist (v0, v1) {
            var dx = v1.x - v0.x;
            var dy = v1.y - v0.y;
            var dz = v1.z - v0.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        },

        normalize (v, out) {
            Terra_Vec.Vec3.setLength(v, 1.0, out);
        },

        dot (a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        },

        cross (a, b, out) {
            var ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z;
            out.x = ay * bz - az * by;
            out.y = az * bx - ax * bz;
            out.z = ax * by - ay * bx;
        },

        toArray (v) {
            return [v.x, v.y, v.z];
        }
    }

    // RGB COLOR FUNCTIONS

    static Color = {
        create (r, g, b) {
            return {
                r: (typeof r === 'number') ? r : 0.0,
                g: (typeof g === 'number') ? g : 0.0,
                b: (typeof b === 'number') ? b : 0.0
            };
        },

        toArray (c) {
            return [c.r, c.g, c.b];
        },

        to24bit (c) {
            return (c.r * 255) << 16 ^ (c.g * 255) << 8 ^ (c.b * 255) << 0;
        }
    }
}


