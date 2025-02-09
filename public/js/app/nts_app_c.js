// USES:
// NTS_UTIL
// NTS_LOADER
// NTS_INPUT
// NTS_ANIM
// NTS_FULLSCREEN
// NTS_WORLD_C
// NTS_BROWSER

// USED IN:
// -

// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

class NTS_APP_C {
    constructor() {
        this.nts_Util = NTS_UTIL;
        this.loader_1 = NTS_LOADER;
        this.input = NTS_INPUT;
        this.anim = NTS_ANIM;
        this.fullscreen = NTS_FULLSCREEN;
        this.WORLD = NTS_WORLD_C;

        // circa 2016
        this.CONFIGS = {
            mobile: { blades: 20000, depth: 50.0, antialias: false },
            laptop: { blades: 40000, depth: 65.0, antialias: false },
            desktop: { blades: 84000, depth: 85.0, antialias: true },
            desktop2: { blades: 250000, depth: 125.0, antialias: true },
            gamerig: { blades: 500000, depth: 175.0, antialias: true },
        };

        // DOM element containing canvas
        this.container = this.nts_Util.docGetElById("app_canvas_container");

        // Will be set correctly later
        this.displayWidth = 640;
        this.displayHeight = 480;
        this.assets;
        this.world;
        this.isFullscreen = this.fullscreen.is();

        // turn on/off the load options screen
        this.showOptionScreen = false;
    }

    // Call this when HTML page elements are loaded & ready
    run() {
        if (!this.nts_Util.docGetElById("app_canvas_container")) {
            console.error("app_canvas_container element not found in page");
            return false;
        }

        if (!this.nts_Util.detectWebGL()) {
            this.nts_Util.docGetElById("loading_text").textContent = "WebGL unavailable.";
            return false;
        }

        this.resize();
        this.loadAssets();
        this.configUI();
        window.addEventListener("resize", this.resize.bind(this), false);

        return true;
    }

    // Configuration UI input handlers
    configUI() {
        // Select a config roughly based on device type
        // Or, it just picks a default if it's not mobile
        let cfgDevice = NTS_BROWSER.isMobile.any ? "mobile" : "gamerig";
        let cfg = this.CONFIGS[cfgDevice];

        let sel = this.nts_Util.docGetElById("sel_devicepower");
        sel.value = cfgDevice;

        let inp_blades = this.nts_Util.docGetElById("inp_blades");
        inp_blades.value = cfg.blades.toString();

        let inp_depth = this.nts_Util.docGetElById("inp_depth");
        inp_depth.value = cfg.depth.toString();

        this.nts_Util.docGetElById("chk_antialias").checked = cfg.antialias;
        this.nts_Util.docGetElById("chk_fullscreen").checked = false;

        this.nts_Util.docGetElById("chk_fullscreen").onchange = function () {
            this.fullscreen.toggle(this.nts_Util.docGetElById("app_container"));
        }.bind(this);

        sel.onchange = (e) => {
            let cfg = this.CONFIGS[sel.value];
            let b = cfg.blades.toString();
            let d = cfg.depth.toString();
            inp_blades.value = b;
            inp_depth.value = d;
            this.nts_Util.docGetElById("txt_blades").textContent = b;
            this.nts_Util.docGetElById("txt_depth").textContent = d;
            this.nts_Util.docGetElById("chk_antialias").checked = cfg.antialias;
        };

        this.nts_Util.docGetElById("txt_blades").textContent = cfg.blades.toString();
        this.nts_Util.docGetElById("txt_depth").textContent = cfg.depth.toString();

        inp_blades.onchange = function (e) {
            this.nts_Util.docGetElById("txt_blades").textContent = inp_blades.value;
        }.bind(this);

        inp_depth.onchange = function (e) {
            this.nts_Util.docGetElById("txt_depth").textContent = inp_depth.value;
        }.bind(this);
    }

    // TODO this should be in its own file
    loadAssets() {
        let onAssetsDone = function () {
            //console.log('onAssetsDone called or, have we, as \'twere with a defeated joy loaded all assets');
        };

        let onAssetsProgress = function (p) {
            //console.log('onAssetsProgress');
            let pct = Math.floor(p * 90);
            this.nts_Util.docGetElById("loading_bar").style.width = pct + "%";
        }.bind(this);

        let onAssetsError = function (e) {
            console.error("onAssetsError");
            this.nts_Util.docGetElById("loading_text").textContent = e;
        }.bind(this);

        let continueLoad = function () {
            this.anim.fadeOut(this.nts_Util.docGetElById("loading_block"), 80, () => {
                this.nts_Util.docGetElById("loading_block").style.display = "none";
                this.nts_Util.docGetElById("app_ui_container").style.backgroundColor = "transparent";

                if (!this.isFullscreen) {
                    this.nts_Util.docGetElById("title_bar").style.display = "block";
                }

                this.nts_Util.docGetElById("btn_fullscreen").onclick = () => {
                    this.fullscreen.toggle(nts_Util.docGetElById("app_container"));
                };

                this.nts_Util.docGetElById("btn_restart").onclick = () => {
                    document.location.reload();
                };

                this.start();
            });
        }.bind(this);

        let onAssetsLoaded = function (a) {
            //console.log('onAssetsLoaded');
            this.assets = a;
            this.nts_Util.docGetElById("loading_bar").style.width = "100%";
            this.nts_Util.docGetElById("loading_text").innerHTML = "&nbsp;";

            setTimeout(() => {
                this.nts_Util.docGetElById("loading_bar_outer").style.visibility = "hidden";
                this.nts_Util.docGetElById("config_block").style.visibility = "visible";

                if(this.showOptionScreen) {
                    this.nts_Util.docGetElById("btn_start").onclick = () => {
                        continueLoad();
                    };
                } else {
                    continueLoad();
                }
                
            }, 10);
        }.bind(this);

        this.loader_1.load(
            {
                text: [
                    { name: "grass.vert", url: "shader/grass.vert.glsl" },
                    { name: "grass.frag", url: "shader/grass.frag.glsl" },
                    { name: "terrain.vert", url: "shader/terrain.vert.glsl" },
                    { name: "terrain.frag", url: "shader/terrain.frag.glsl" },
                    { name: "water.vert", url: "shader/water.vert.glsl" },
                    { name: "water.frag", url: "shader/water.frag.glsl" },
                ],
                images: [
                    { name: "heightmap", url: "data/heightmap.jpg" },
                    { name: "noise", url: "data/noise.jpg" },
                ],
                textures: [
                    { name: "grass", url: "data/grass.jpg" },
                    { name: "terrain1", url: "data/terrain1.jpg" },
                    { name: "terrain2", url: "data/terrain2.jpg" },
                    { name: "skydome", url: "data/skydome.jpg" },
                    { name: "skyenv", url: "data/skyenv.jpg" },
                ],
                models: [{ name: "drone", url: "models/mech_drone_4mb_dl.glb" }],
            },
            onAssetsLoaded,
            onAssetsProgress,
            onAssetsError,
            onAssetsDone
        );
    }

    // All stuff loaded, setup event handlers & start the app...
    start() {
        // music
        if (this.nts_Util.docGetElById("chk_audio").checked) {
            let au = this.nts_Util.docGetElById("chopin");
            au.loop = true;
            au.play();
        }

        // input
        this.input.init();

        // Get detail settings from UI inputs
        let numGrassBlades = +this.nts_Util.docGetElById("inp_blades").value;
        let grassPatchRadius = +this.nts_Util.docGetElById("inp_depth").value;
        let antialias = !!this.nts_Util.docGetElById("chk_antialias").checked;

        // Create an instance of the world
        this.world = new this.WORLD(
            this.assets,
            numGrassBlades,
            grassPatchRadius,
            this.displayWidth,
            this.displayHeight,
            antialias
        );

        // Start our animation loop
        this.doFrame();
    }

    doFrame() {
        // keep animation loop running
        this.world.doFrame();
        requestAnimationFrame(this.doFrame.bind(this));
    }

    /*
    window.addEventListener(
        "resize",
        function () {
            CHASE_CAMERA.aspect = window.innerWidth / window.innerHeight;
            CHASE_CAMERA.updateProjectionMatrix();
            RENDERER.setSize(window.innerWidth, window.innerHeight);
        },
        false
    );
    */

    // Handle window resize events
    resize() {
        this.displayWidth = window.innerWidth;
        this.displayHeight = window.innerHeight;

        if (this.world) {
            this.world.resize(this.displayWidth, this.displayHeight);
        } else {
            let canvas = document.getElementById("app_canvas");
            canvas.width = this.displayWidth;
            canvas.height = this.displayHeight;
        }

        // Seems to be a good place to check for fullscreen toggle.
        let fs = this.fullscreen.is();

        if (fs !== this.isFullscreen) {
            // Show/hide the UI when switching windowed/FS mode.
            document.getElementById("title_bar").style.display = fs ? "none" : "block";
            this.isFullscreen = fs;
        }
    }

    //  Return public interface
    //    return {
    //        run: run
    //    };
}
