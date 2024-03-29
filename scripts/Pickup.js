import { PlaneGeometry, RepeatWrapping, TextureLoader, MeshStandardMaterial } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { Actor } from "./Actor.js";
import { Player } from "./Player.js";

export class Pickup extends Actor
{
    constructor(position)
    {
        const geometry = new PlaneGeometry(1, 1);

        const spriteSheet = new TextureLoader().load('textures/sprites/red_orb.png');

        spriteSheet.wrapS = RepeatWrapping;
        spriteSheet.wrapT = RepeatWrapping;
        spriteSheet.repeat.set(1 / 4, 1);

        spriteSheet.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const material = new MeshStandardMaterial({ map: spriteSheet, transparent: true });

        super(geometry, material);

        this.position.copy(position);

        this.timeSinceSpriteUpdate = 0;
        this.spriteSheet = spriteSheet;

        this.uses = 1;
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);

        if (this.timeSinceSpriteUpdate++ > 5)
        {
            this.spriteSheet.offset.x += 1 / 4;
            if (this.spriteSheet.offset > 1)
                this.spriteSheet.offset = 0;

            this.timeSinceSpriteUpdate = 0;
        }
    }

    onStartTrigger(object)
    {
        super.onStartTrigger(object);

        if (object instanceof Player)
        {
            if (this.uses++ >= 1)
            {
                console.log("player picked up heaklth");

                player.health += 5;
                $("#health").val(player.health);
                scene.remove(this);
            }
        }
    }
};
