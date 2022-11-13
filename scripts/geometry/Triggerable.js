import { BoxGeometry, MeshStandardMaterial, Mesh, Box3 } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { DynamicMesh } from "./DynamicMesh.js";

export class Triggerable extends DynamicMesh
{
    constructor(geometry, material, triggerWidth, triggerLength)
    {
        super(geometry, material);
        
        const triggerGeometry = new BoxGeometry(triggerWidth, triggerLength, 0.1);
        const triggerMaterial = new MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
        
        this.triggerObject = new Mesh(triggerGeometry, triggerMaterial);
        this.triggerObject.geometry.computeBoundingBox();
        this.attach(this.triggerObject);
        this.triggerObject.position.z = 0;
        
        this.trigger = new Box3();
        
        this.triggered = false;
        this.triggeringObjects = new Array();
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);
        
        this.trigger.copy(this.triggerObject.geometry.boundingBox).applyMatrix4(this.triggerObject.matrixWorld);
    }
    
    onStartTrigger(object)
    {
        if (this.triggeringObjects.includes(object))
            return false;
        
        this.triggered = true;
        this.triggeringObjects.push(object);
        
        this.triggerObject.material.color.setHex(0x00ff00);

        return true;
    }

    onTrigger(object)
    {
        return true;
    }
    
    onStopTrigger(object)
    {
        if (!this.triggered)
            return false;
            
        if (!this.triggeringObjects.includes(object))
            return false;
            
        this.triggeringObjects.splice(this.triggeringObjects.indexOf(object), 1);
        
        if (this.triggeringObjects.length <= 0)
        {
            this.triggered = false;
            this.triggerObject.material.color.setHex(0xff0000);
        }
    }
};