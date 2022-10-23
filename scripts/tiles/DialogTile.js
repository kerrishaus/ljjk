import { Vector3, Quaternion, TextureLoader, MeshStandardMaterial } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { Triggerable } from "../geometry/Triggerable.js";
import { Player } from "../Player.js";

export class DialogTile extends Triggerable
{
    constructor()
    {
        super(6, 2, 8, 4, 0xad723e);

        this.name = "dialog";
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);
    }

    startDialog()
    {
        console.log("starting dialog");

        $("body").append("<div style='position:absolute; z-index: 1000; left: 50px; top: 100px; background-color: red; color: white;' id='dialogContainer'>hello!</div>");
    }

    stopDialog()
    {
        console.log("stopping dialog");

        $("#dialogContainer").remove();
    }
    
    onStartTrigger(object)
    {
        super.onStartTrigger(object);

        if (object instanceof Player)
            this.startDialog();
    }
    
    onStopTrigger(object)
    {
        super.onStopTrigger(object);

        this.stopDialog();
    }
};
