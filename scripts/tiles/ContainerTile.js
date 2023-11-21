import { Vector3 } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { Tile } from "./Tile.js";

import { Player } from "../Player.js";

export class ContainerTile extends Tile
{
    // TODO: improve this constructor
    constructor(geometry, material)
    {
        super(geometry, material);

        this.carriedItems = new Array();
        this.maxItems = 9;

        this.name     = null;
        this.itemType = null;
    }

    onTrigger(object)
    {
        super.onTrigger(object);
    }
    
    onStopTrigger(object)
    {
        super.onStopTrigger(object);
    }
};