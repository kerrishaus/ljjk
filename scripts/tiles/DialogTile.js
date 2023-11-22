import { Vector3, RepeatWrapping, TextureLoader, MeshStandardMaterial, PlaneGeometry } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import * as MathUtility from "../MathUtility.js";
import * as Weather from "../Weather.js";

import { DialogBox } from "../DialogBox.js";
import { Player } from "../Player.js";
import { Enemy } from "../Enemy.js";
import { Tile } from "./Tile.js";

export class DialogTile extends Tile
{
    constructor(dialog)
    {
        const geometry = new PlaneGeometry(1, 1);

        const spriteSheet = new TextureLoader().load('textures/sprites/player.png');

        spriteSheet.wrapS = RepeatWrapping;
        spriteSheet.wrapT = RepeatWrapping;
        spriteSheet.repeat.set(0.058, 1);

        spriteSheet.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const material = new MeshStandardMaterial({ map: spriteSheet, transparent: true });

        super(geometry, material);

        this.name = "dialog";

        /*
        this.dialog = new DialogBox({ message: message, buttons: [
            {
                message: "Oh fuck!",
                onClick: () =>
                {
                    for (let i = 0; i < 10; i++)
                    {
                        let enemy = new Enemy(player);
                        enemy.position.copy(new Vector3(MathUtility.getRandomInt(-10, 10), MathUtility.getRandomInt(-10, 10), 0));
                        scene.add(enemy);
                    }

                    Weather.startRain();
                    Weather.lightning();

                    this.stopDialog();

                    scene.remove(this);
                    this.remove();
                }
            }
        ] });
        */
        this.dialog = dialog;

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
