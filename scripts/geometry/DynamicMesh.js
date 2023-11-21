import { Box3 } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { TriggerableMesh } from "./TriggerableMesh.js";

export class DynamicMesh extends TriggerableMesh
{
    constructor(geometry, material)
    {
        super(geometry, material);

        this.castShadow = true;
        this.receiveShadow = true;
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);
    }
};