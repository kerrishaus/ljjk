import { RepeatWrapping, TextureLoader, PlaneGeometry, Vector3, Quaternion, BoxGeometry, MeshStandardMaterial, PerspectiveCamera } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { ItemCarrier } from "./ItemCarrier.js";

import * as GeometryUtil from "./geometry/GeometryUtility.js";

export class Player extends ItemCarrier
{
    constructor()
    {
        const geometry = new PlaneGeometry(2, 2);

        const spriteSheet = new TextureLoader().load('textures/sprites/player.png');

        spriteSheet.wrapS = RepeatWrapping;
        spriteSheet.wrapT = RepeatWrapping;
        spriteSheet.repeat.set(0.058, 1);

        spriteSheet.anisotropy = renderer.capabilities.getMaxAnisotropy();

        spriteSheet.rotation = 1.5708;

        const material = new MeshStandardMaterial({ map: spriteSheet, transparent: true });

        super(geometry, material);

        this.spriteSheet = spriteSheet;

        //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
		        
        this.maxSpeed = 0.3;
        
        this.move = null;

        this.spriteUpdateTime = 0.5; // in seconds
        this.timeSinceLastSpriteUpdate = 0;
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);

        if (this.move)
        {
            this.timeSinceLastSpriteUpdate += deltaTime;

            if (this.timeSinceLastSpriteUpdate > this.spriteUpdateTime)
            {
                this.spriteSheet.offset.x += 0.0586;

                this.timeSinceLastSpriteUpdate = 0;
            }
        }
    }
};