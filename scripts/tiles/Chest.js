import { PlaneGeometry, RepeatWrapping, Vector3, Quaternion, TextureLoader, MeshStandardMaterial } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { DialogBox } from "../dialog/DialogBox.js";

import { Triggerable } from "../geometry/Triggerable.js";
import { Player } from "../Player.js";

export class Chest extends Triggerable
{
    constructor(message, printSpeed, triggerWidth, triggerLength)
    {
        const geometry = new PlaneGeometry(1, 1);

        const spriteSheet = new TextureLoader().load('textures/sprites/chest.png');

        spriteSheet.wrapS = RepeatWrapping;
        spriteSheet.wrapT = RepeatWrapping;
        spriteSheet.repeat.set(0.5, 1);

        spriteSheet.anisotropy = renderer.capabilities.getMaxAnisotropy();

        spriteSheet.rotation = 1.5708;

        const material = new MeshStandardMaterial({ map: spriteSheet, transparent: true });

        super(geometry, material, triggerWidth, triggerLength);

        this.spriteSheet = spriteSheet;

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

        this.spriteSheet.offset.x = 0.5;
    }

    stopDialog()
    {
        this.dialog.hideDialog();

        this.spriteSheet.offset.x = 0;
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
