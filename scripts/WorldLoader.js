import * as THREE from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { DialogTile } from "./tiles/DialogTile.js";
import { DialogBox } from "./DialogBox.js";

export function loadTiles(level)
{
    console.log("Loading tiles...");

    for (const tile of level.world.tiles)
    {   
        let object = null;

        if (tile.type == "DialogTile")
        {
            object = new DialogTile(new DialogBox({
                message: tile.message,
                buttons: tile.buttons
            }));

            scene.add(object);
            return;
        }

        let geometry = null;

        if (tile.type == "plane")
            geometry = new THREE.PlaneGeometry(tile.width, tile.height);
        else
            console.error("No geometry was provided for object.");

        let material = null;

        if ("spritesheets" in tile)
        {
            // TODO: implement support for multiple sprites
            const texture  = new THREE.TextureLoader().load(tile.spritesheets[0]);
            texture.repeat = new THREE.Vector2(3, 3);
            texture.wrapS  = THREE.RepeatWrapping;
            texture.wrapT  = THREE.RepeatWrapping;
            material = new THREE.MeshStandardMaterial({ map: texture });
        }
        else
            console.error("No spritesheets were provided for object.");

        if (geometry === null || material === null)
        {
            console.error("Geometry or material is null for object, skipping.");
            continue;
        }

        object = new THREE.Mesh(geometry, material);

        if ("position" in tile)
        {
            object.position.x = tile.position.x ?? 0;
            object.position.y = tile.position.y ?? 0;
            object.position.z = tile.position.z ?? 0;
        }

        scene.add(object);

        console.log("Added object.");
    }
}