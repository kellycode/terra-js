import * as THREE from "three";

// Terra_Heightfield infoAt stopped working when I rotated
// the terrain to y up so made a duplicate mesh not glsl
// to easily get height at a point

export class Terra_Terrain_Fake {
    constructor(scene, assets) {
        this.scene = scene;
        this.assets = assets;

        this.GROUND_DATA = {}
        this.SNOW_GROUND = assets.textures["snow"];
        this.HEIGHT_MAP = assets.images["heightmap"];
        this.TEXTURE_REPEAT = 10;

        this.GROUND_SIZE = 3050;
        this.GROUND_Y = 0;
        // scale the terrain height
        this.TERRAIN_HEIGHT_MOD = 0.71;

        this.SNOW_GROUND.wrapS = THREE.RepeatWrapping;
        this.SNOW_GROUND.wrapT = THREE.RepeatWrapping;
        this.SNOW_GROUND.repeat.set(this.TEXTURE_REPEAT, this.TEXTURE_REPEAT);

        this.terrain = this.getMapPixelData("heightmap_image", "heightmap_canvas");

        // set the snow material
        this.GROUND_DATA.material = new THREE.MeshStandardMaterial({
            color: 0xccccff,
            roughness: 1.0,
            map: this.SNOW_GROUND,
            bumpMap: this.SNOW_GROUND,
            bumpScale: 5,
            flatShading: false,
            fog: true,
            //opacity: 0.2,
            //transparent: true
        });

        /*
         * PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
         * width — Width along the X axis. Default is 1.
         * height — Height along the Y axis. Default is 1.
         * widthSegments — Optional. Default is 1.
         * heightSegments — Optional. Default is 1.
         *
         * Our heightmap is a component of our structure and simply an array of data
         * more than an image: Keep in mind that the GROUND_MESH geometry always has +1 more vertices
         * than segments. If there's 100 x 100 segments means 101 x 101 vertices, etc,.
         * This means that the texture image should always be +1 width and height to
         * the segments and that number is sent back with the pixel data
         */
        this.GROUND_DATA.GEOMETRY = new THREE.PlaneGeometry(
            this.GROUND_SIZE,
            this.GROUND_SIZE,
            this.terrain.segments,
            this.terrain.segments
        );
        this.GROUND_DATA.GEOMETRY.userData.vertices = [];

        // actually create and add the ground
        this.GROUND_DATA.MESH = new THREE.Mesh(this.GROUND_DATA.GEOMETRY, this.GROUND_DATA.material);
        this.GROUND_DATA.MESH.position.set(0, 0, 0);

        //rotate it so up is Y
        this.GROUND_DATA.MESH.geometry.rotateX(-Math.PI / 2);

        //update its matrix so the vertex positions reflect the rotation
        this.GROUND_DATA.MESH.updateMatrix();
        this.GROUND_DATA.MESH.geometry.applyMatrix4(this.GROUND_DATA.MESH.matrix);
        this.GROUND_DATA.MESH.matrix.identity();

        // yes, we will have shadows
        this.GROUND_DATA.MESH.receiveShadow = true;

        // here we apply the height information from the image to the PlaneGeometry.
        // So modifying the Y position of all vertices to show ground height according
        // to our map
        const positionAttribute = this.GROUND_DATA.GEOMETRY.getAttribute("position");

        for (let i = 0; i < positionAttribute.count; i++) {
            // temp vertex holder
            const vertex = new THREE.Vector3();
            // extract the vertex information
            vertex.fromBufferAttribute(positionAttribute, i);
            // add the image data and whatever mod we decised on
            vertex.y += this.terrain.data[i] * this.TERRAIN_HEIGHT_MOD;
            // and set that position
            positionAttribute.setY(i, vertex.y);
            // while we're here looping over the vertex data, get the vertex xyz
            // positions and store them for easy use later when positioning objects
            // on the ground
            this.GROUND_DATA.GEOMETRY.userData.vertices.push(vertex);
        }

        // calculate the highpoint for the wolf
        let vertices = this.GROUND_DATA.GEOMETRY.userData.vertices;
        this.GROUND_DATA.HIGHPOINT = new THREE.Vector3(0, 0, 0);
        // the highest z is the hill top
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].y > this.GROUND_DATA.HIGHPOINT.y) {
                this.GROUND_DATA.HIGHPOINT.copy(vertices[i]);
            }
        }

        // and add it
        this.GROUND_DATA.MESH.name = "fake_ground";
        this.GROUND_DATA.MESH.position.y = this.GROUND_Y;
        this.GROUND_DATA.MESH.visible = false;
        this.scene.add(this.GROUND_DATA.MESH);

        // not used atm but a way to get an image from a canvas for a material
        // /this.pattern = this.getTexturePatternImage(this.GROUND_DATA, "pattern_canvas");

        this.initLights();
    }

    getMapPixelData(image_elem, canvas_elem) {
        let img = document.getElementById(image_elem);
        let canvas = document.getElementById(canvas_elem);

        canvas.width = img.width;
        canvas.height = img.height;

        /*
         * the image is loaded in the browser as a standard img tag and
         * we get the pixel data out of it to make the height map.
         *
         */

        if (img.width !== img.height) {
            alert(
                "Terrain hightmap requires equal width and heights!\nCurrent width x height is " +
                    img.width +
                    " x " +
                    img.height
            );
            console.error(
                "Terrain hightmap requires equal width and heights!\nCurrent width x height is " +
                    img.width +
                    " x " +
                    img.height
            );
        }

        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);

        /**
         * The readonly ImageData.data property returns a Uint8ClampedArray representing
         * a one-dimensional array containing the data in the RGBA order, with integer
         * values between 0 and 255 (included).
         * * https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
         *
         * RGBA color values are an extension of RGB color values with an alpha channel
         * - which specifies the opacity for a color. An RGBA color value is specified
         * with: rgba(red, green, blue, alpha). The alpha parameter is a number between
         * 0.0 (fully transparent) and 1.0 (fully opaque).
         * * https://www.w3schools.com/css/css3_colors.asp
         */

        let imgData = canvas.getContext("2d").getImageData(0, 0, img.height, img.width);
        let data = imgData.data;
        let normPixels = [];

        for (let i = 0, n = data.length; i < n; i += 4) {
            const AVERAGE_NUM = 3;

            /**
             * get the average value of the R, G, B values
             *
             * Because a height describes our height values based on a grayscale /
             * monochrome color image map we're getting our height by averaging the
             * three rgb color values.  They should all be the same value anyway but
             * averaging would allow using images that may not be monochrome
             */
            normPixels.push((data[i] + data[i + 1] + data[i + 2]) / AVERAGE_NUM);
        }

        let terrain = {
            data: normPixels,
            segments: img.width - 1,
        };

        return terrain;
    }

    getTexturePatternImage(GROUND_DATA, canvas_elem) {
        // <canvas id="canvas" width="300" height="300"></canvas>
        const canvas = document.getElementById(canvas_elem);
        const ctx = canvas.getContext("2d");
        let texture;

        //const patternCanvas = document.createElement("canvas");
        //const patternContext = patternCanvas.getContext("2d");

        const img = new Image();
        img.src = "../assets/terrain2.jpg";
        img.onload = () => {
            var tempCanvas = document.createElement("canvas");
            var tCtx = tempCanvas.getContext("2d");
            var desiredHeight = 100;
            var desiredWidth = 100;
            // Set the width and height of the temporary canvas to the desired size
            tempCanvas.width = desiredWidth;
            tempCanvas.height = desiredHeight;
            // Draw the image onto the temporary canvas, scaling it to the desired size
            tCtx.drawImage(img, 0, 0, desiredWidth, desiredHeight);

            var canvas = document.getElementById(canvas_elem);
            var ctx = canvas.getContext("2d");

            // Create the pattern using the temporary canvas
            ctx.fillStyle = ctx.createPattern(tempCanvas, "repeat");

            // Fill the canvas with the pattern
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            texture = new THREE.CanvasTexture(canvas);

            //GROUND_DATA.material.map = texture;
            //GROUND_DATA.material.bumpMap = texture;
        };
    }

    initLights() {
        this.LIGHT_SPECS = {
            ALIGHT_COLOR: 0x666666,
            DLIGHT_COLOR: 0x455767,
            DLIGHT_POS: this.MOONLIGHT_POS,
            DLIGHT_CAST: true,
            DLIGHT_SHADOW_TR: 5000,
            DLIGHT_SHADOW_BL: -5000,
            DLIGHT_SHADOW_MAPSIZE: 2048,
            DLIGHT_SHADOW_NEAR: 0.5,
            DLIGHT_SHADOW_FAR: this.GROUND_SIZE * 2
        };

        //  low evening light
        let ambientLight = new THREE.AmbientLight(this.LIGHT_SPECS.ALIGHT_COLOR, Math.PI / 2);
        ambientLight.intensity = Math.PI;

        this.scene.add(ambientLight);

        // // simulated moonlight
        // let directionalLight = new THREE.DirectionalLight(this.LIGHT_SPECS.DLIGHT_COLOR, Math.PI);
        // directionalLight.position.copy(this.LIGHT_SPECS.DLIGHT_POS);
        // directionalLight.castShadow = this.LIGHT_SPECS.DLIGHT_CAST;

        // // shadows
        // directionalLight.shadow.camera.top = this.LIGHT_SPECS.DLIGHT_SHADOW_TR;
        // directionalLight.shadow.camera.right = this.LIGHT_SPECS.DLIGHT_SHADOW_TR;
        // directionalLight.shadow.camera.bottom = this.LIGHT_SPECS.DLIGHT_SHADOW_BL;
        // directionalLight.shadow.camera.left = this.LIGHT_SPECS.DLIGHT_SHADOW_BL;

        // directionalLight.shadow.mapSize.width = this.LIGHT_SPECS.DLIGHT_SHADOW_MAPSIZE;
        // directionalLight.shadow.mapSize.height = this.LIGHT_SPECS.DLIGHT_SHADOW_MAPSIZE;

        // directionalLight.shadow.camera.near = this.LIGHT_SPECS.DLIGHT_SHADOW_NEAR; // default
        // directionalLight.shadow.camera.far = this.LIGHT_SPECS.DLIGHT_SHADOW_FAR;

        // this.scene.add(directionalLight);
    }

}