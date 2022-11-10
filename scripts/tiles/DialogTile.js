import { Vector3, Quaternion, RepeatWrapping, TextureLoader, MeshStandardMaterial, PlaneGeometry } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { DialogBox } from "../dialog/DialogBox.js";

import { Triggerable } from "../geometry/Triggerable.js";
import { Player } from "../Player.js";

export class DialogTile extends Triggerable
{
    constructor(message, printSpeed, position, size)
    {
        const geometry = new PlaneGeometry(size.x, size.y);

        const spriteSheet = new TextureLoader().load('textures/sprites/player.png');

        spriteSheet.wrapS = RepeatWrapping;
        spriteSheet.wrapT = RepeatWrapping;
        spriteSheet.repeat.set(0.058, 1);

        spriteSheet.anisotropy = renderer.capabilities.getMaxAnisotropy();

        //spriteSheet.rotation = 1.5708;

        const material = new MeshStandardMaterial({ map: spriteSheet, transparent: true });

        super(geometry, material, size.x, size.y);

        this.position.copy(position);

        this.name = "dialog";

        this.dialog = new DialogBox(message, printSpeed);
        this.printSpeed = printSpeed;
        this.printInterval = null;
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
