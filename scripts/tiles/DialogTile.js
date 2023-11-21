import { RepeatWrapping, TextureLoader, MeshStandardMaterial, PlaneGeometry } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { DialogBox } from "../DialogBox.js";
import { Player } from "../Player.js";
import { Tile } from "./Tile.js";

export class DialogTile extends Tile
{
    constructor(message, position)
    {
        const geometry = new PlaneGeometry(1, 1);

        const spriteSheet = new TextureLoader().load('textures/sprites/player.png');

        spriteSheet.wrapS = RepeatWrapping;
        spriteSheet.wrapT = RepeatWrapping;
        spriteSheet.repeat.set(0.058, 1);

        spriteSheet.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const material = new MeshStandardMaterial({ map: spriteSheet, transparent: true });

        super(geometry, material);

        this.position.copy(position);

        this.name = "dialog";

        this.dialog = new DialogBox(message);
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
