import { Texture, RepeatWrapping, TextureLoader } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

export class Spritesheet /*extends Texture*/
{
    constructor(filename, frames, textureWidth)
    {
        this.filename = filename;
        this.frames = frames;

        this.texture = new TextureLoader().load(`textures/sprites/${this.filename}.png`);

        this.texture.wrapS = RepeatWrapping;
        this.texture.wrapT = RepeatWrapping;
        this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        this.frameWidth = 1 / this.frames;
        this.texture.repeat.set(this.frameWidth, 1);
    }
}