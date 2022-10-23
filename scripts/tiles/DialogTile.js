import { Vector3, Quaternion, TextureLoader, MeshStandardMaterial } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { DialogBox } from "../dialog/DialogBox.js";

import { Triggerable } from "../geometry/Triggerable.js";
import { Player } from "../Player.js";

export class DialogTile extends Triggerable
{
    constructor(message)
    {
        super(6, 2, 8, 4, 0xad723e);

        this.name = "dialog";

        this.dialog = new DialogBox(message);
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);
    }

    startDialog()
    {
        this.dialog.presentDialog();
    }

    stopDialog()
    {
        this.dialog.hideDialog();
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
