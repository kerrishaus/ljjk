import { Vector3, Quaternion, BoxGeometry, MeshStandardMaterial, PerspectiveCamera } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { ItemCarrier } from "./ItemCarrier.js";

import * as GeometryUtil from "./geometry/GeometryUtility.js";

export class Player extends ItemCarrier
{
    constructor()
    {
        const geometry = new BoxGeometry(1, 1, 2);
        const material = new MeshStandardMaterial({ color: 0x0000ff });
        
        super(geometry, material);

        //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
		        
        this.maxSpeed = 0.3;
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);
    }
};