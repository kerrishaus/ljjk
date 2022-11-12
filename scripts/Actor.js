import { RepeatWrapping, TextureLoader } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { ItemCarrier } from "./ItemCarrier.js";
import { Spritesheet } from "./Spritesheet.js";

export class Actor extends ItemCarrier
{
    constructor(geometry, material)
    {
        super(geometry, material);

        this.spriteSheets = new Map();
        this.currentSheet = null;

        this.timeSinceLastSpriteUpdate = 0;

        this.spriteUpdateTime = 0.25; // in seconds
    }

    update(deltaTime)
    {
        super.update(deltaTime);

        // update the sprite animation time
        this.timeSinceLastSpriteUpdate += deltaTime;
        if (this.timeSinceLastSpriteUpdate > this.spriteUpdateTime)
        {
            this.currentSheet.texture.offset.x += this.currentSheet.frameWidth;
            
            this.timeSinceLastSpriteUpdate = 0;
        }
    }

    addSpriteSheet(name, frames, frameWidth)
    {
        if (this.spriteSheets.has(name))
        {
            console.warn("Actor already contains " + name);
            return
        }

        const spritesheet = new Spritesheet(name, frames, frameWidth);

        this.spriteSheets.set(name, spritesheet);
    }

    removeSpriteSheet(name)
    {
        return this.spriteSheets.delete(name);
    }

    setSpriteSheet(name)
    {
        if (!this.spriteSheets.has(name))
        {
            console.warn("Actor does not contain " + name);
            return;
        }

        this.currentSheet = null;

        this.currentSheet = this.spriteSheets.get(name);
        this.material.map = this.currentSheet.texture;
    }

    setSpriteFrame(frame)
    {
        this.currentSheet.offset.x = frame * this.currentSheet.frameWidth;
    }
}