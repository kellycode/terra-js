// LICENSE: MIT
// Copyright (c) 2016 by Mike Linkovich

"use strict";

export class Terra_Loader {

    static isLoading = false;
    static totalToLoad = 0;
    static numLoaded = 0;
    static numFailed = 0;
    static success_callback = null;
    static progress_callback = null;
    static error_callback = null;
    static done_cb = null;
    
    static assets = { images: {}, text: {}, textures: {}, models: {} };
    
    // Start loading a list of assets
    static load (assetList, onAssetsLoaded, onAssetsProgress, onAssetsError, onAssetsDone) {
        this.success_callback = onAssetsLoaded;
        this.progress_callback = onAssetsProgress;
        this.error_callback = onAssetsError;
        this.done_cb = onAssetsDone;
        this.totalToLoad = 0;
        this.numLoaded = 0;
        this.numFailed = 0;
        this.isLoading = true;

        if (assetList.text) {
            this.totalToLoad += assetList.text.length;
            for (let i = 0; i < assetList.text.length; ++i) {
                this.loadText(assetList.text[i]);
            }
        }

        if (assetList.images) {
            this.totalToLoad += assetList.images.length;
            for (let i = 0; i < assetList.images.length; ++i) {
                this.loadImage(assetList.images[i]);
            }
        }

        if (assetList.textures) {
            this.totalToLoad += assetList.textures.length;
            for (let i = 0; i < assetList.textures.length; ++i) {
                this.loadTexture(assetList.textures[i]);
            }
        }

        if (assetList.models) {
            this.totalToLoad += assetList.models.length;
            for (let i = 0; i < assetList.models.length; ++i) {
                this.loadGLTF(assetList.models[i]);
            }
        }
    };

    static loadText (ad) {
        let req = new XMLHttpRequest();
        req.overrideMimeType('*/*');
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    this.assets.text[ad.name] = req.responseText;
                    this.doProgress();
                } else {
                    this.doError("Error " + req.status + " loading " + ad.url);
                }
            }
        };
        req.open('GET', ad.url);
        req.send();
    };

    static loadImage (ad) {
        // maintaining a 'pointer' to 'this'
        let doProgressCallback = this.doProgress.bind(this);
        let doErrorCallback = this.doError.bind(this);
        let img = new Image();
        this.assets.images[ad.name] = img;
        img.onload = doProgressCallback;
        img.onerror = doErrorCallback;
        img.src = ad.url;
    };

    static loadGLTF (ad) {
        let assets = this.assets;
        let doProgressCallback = this.doProgress.bind(this);
        let doErrorCallback = this.doError.bind(this);
        const loader = new THREE.GLTFLoader();
        loader.load(
            ad.url,
            function (gltf) {
                assets.models[ad.name] = gltf;
                doProgressCallback();
            },
            undefined,
            function (error) {
                doErrorCallback("Error " + error.respone.statusText + " loading " + ad.url);
            }
        );
    };

    static loadTexture (ad) {
        let doProgressCallback = this.doProgress.bind(this);
        this.assets.textures[ad.name] = new THREE.TextureLoader().load(ad.url, doProgressCallback);
    };

    static doProgress () {
        this.numLoaded += 1;
        console.log("Loaded " + this.numLoaded + " of " + this.totalToLoad + " assets.")
        this.progress_callback && this.progress_callback(this.numLoaded / this.totalToLoad);
        this.tryDone();
    };

    static doError (e) {
        this.error_callback(e);
        this.numFailed += 1;
        this.tryDone();
    };

    static tryDone () {
        if (!this.isLoading) {
            return true;
        }
        if (this.numLoaded + this.numFailed >= this.totalToLoad) {
            let ok = this.numFailed === 0;
            console.log(this.numFailed)
            if (ok && this.success_callback) {
                this.success_callback(this.assets);
            }
            this.done_cb && this.done_cb(ok);
            this.isLoading = false;
        }
        return !this.isLoading;
    };

    static getAssets () {
        return this.assets;
    };

};
