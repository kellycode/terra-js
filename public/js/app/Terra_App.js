import { Terra_World } from "./Terra_World.js"
import { Terra_Input } from "./Terra_Input.js"
import { Terra_Loader } from "./Terra_Loader.js"
import { Terra_Fullscreen } from "./Terra_Fullscreen.js"

export class Terra_App {
    constructor() {        
        // circa 2016
        this.CONFIGS = {
            mobile: { blades: 20000, depth: 50.0, antialias: false },
            laptop: { blades: 40000, depth: 65.0, antialias: false },
            desktop: { blades: 84000, depth: 85.0, antialias: true },
            desktop2: { blades: 250000, depth: 125.0, antialias: true },
            gamerig: { blades: 500000, depth: 175.0, antialias: true },
        };

        // DOM element containing canvas
        this.container = document.getElementById("app_canvas_container");

        // Will be set correctly later
        this.displayWidth = window.innerWidth;
        this.displayHeight = window.innerHeight;
        this.assets;
        this.world;
        this.isFullscreen = Terra_Fullscreen.is();

        // turn on/off the load options screen
        this.showOptionScreen = false;
    }

    detectWebGL() {
        try {
            var canvas = document.createElement('canvas');
            return (!!canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl'));
        } catch (e) {
            return null;
        }
    }

    // Call this when HTML page elements are loaded & ready
    run() {
        if (!document.getElementById("app_canvas_container")) {
            console.error("app_canvas_container element not found in page");
            return false;
        }

        if (!this.detectWebGL()) {
            document.getElementById("loading_text").textContent = "WebGL unavailable.";
            return false;
        }

        // /this.resize();
        this.loadAssets();
        this.configUI();
        window.addEventListener("resize", this.resize.bind(this), false);

        return true;
    }

    // Configuration UI input handlers
    configUI() {

    }

    // TODO this should be in its own file
    loadAssets() {
        let onAssetsDone = function () {
            //console.log('onAssetsDone called or, have we, as \'twere with a defeated joy loaded all assets');
        };

        let onAssetsProgress = function (p) {
            //console.log('onAssetsProgress');
            let pct = Math.floor(p * 90);
            let lb = document.getElementById("loading_bar");
            lb.style.width = pct + "%";
        }.bind(this);

        let onAssetsError = function (e) {
            console.error("onAssetsError");
            document.getElementById("loading_text").textContent = e;
        }.bind(this);

        let continueLoad = function () {
            document.getElementById("app_ui_container").style.backgroundColor = "transparent";
            if (!this.isFullscreen) {
                document.getElementById("title_bar").style.display = "block";
            }
            document.getElementById("btn_fullscreen").onclick = () => {
                Terra_Fullscreen.toggle(document.getElementById("app_container"));
            };

            document.getElementById("btn_restart").onclick = () => {
                document.location.reload();
            };

            this.start();


        }.bind(this);

        let onAssetsLoaded = function (a) {
            this.assets = a;
            document.getElementById("loading_bar").style.width = "100%";
            document.getElementById("loading_text").innerHTML = "&nbsp;";
            document.getElementById("loading_bar_outer").style.visibility = "hidden";
            document.getElementById("loading_block").style.visibility = "hidden";
            continueLoad();
        }.bind(this);

        Terra_Loader.load(
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
                models: [{ name: "tree", url: "models/oak_tree.glb" }],
            },
            onAssetsLoaded,
            onAssetsProgress,
            onAssetsError,
            onAssetsDone
        );
    }

    // All stuff loaded, setup event handlers & start the app...
    start() {

        // input
        Terra_Input.init();

        let antialias = true;

        // Create an instance of the world
        this.world = new Terra_World(
            this.assets,
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

    // Handle window resize events
    resize() {
        this.displayWidth = window.innerWidth;
        this.displayHeight = window.innerHeight;

        if (this.world) {
            this.world.setRenderCamSize(this.displayWidth, this.displayHeight);
        } else {
            let canvas = document.getElementById("app_canvas");
            canvas.width = this.displayWidth;
            canvas.height = this.displayHeight;
        }

        // Seems to be a good place to check for fullscreen toggle.
        let fs = Terra_Fullscreen.is();

        if (fs !== this.isFullscreen) {
            // Show/hide the UI when switching windowed/FS mode.
            document.getElementById("title_bar").style.display = fs ? "none" : "block";
            this.isFullscreen = fs;
        }
    }
}
