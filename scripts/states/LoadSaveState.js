import { State } from "./State.js";

import * as THREE from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import * as PageUtility from "../PageUtility.js";

import * as MathUtility from "../MathUtility.js";
import { PlayState } from "./PlayState.js";
import { Player } from "../Player.js";
import * as SaveLoader from "../SaveLoader.js";
import { Enemy } from "../Enemy.js";
import * as Weather from "../Weather.js";
import { DialogTile } from "../tiles/DialogTile.js";
import { Chest } from "../tiles/Chest.js";
import { Pickup } from "../Pickup.js";

export class LoadSaveState extends State
{
    init(stateMachine)
    {
        this.stateMachine = stateMachine;

        PageUtility.addStyle("loading");

        this.loadingDiv = document.createElement("div");
        this.loadingDiv.id = "loadingDiv";
        this.loadingDiv.classList = "display-flex align-center justify-center";
        this.loadingDiv.textContent = "Loading...";
        document.body.appendChild(this.loadingDiv);

        const saveVersion = 1;

        const saveData = JSON.parse(SaveLoader.saveDataRaw);

        //window.shop = new Shop(saveData.shop);
        //scene.add(shop);

        for (const tile of saveData.shop.tiles)
            this.loadTile(tile);

        window.player = new Player(camera);
        scene.add(player);

        /*
        for (let i = 0; i < 10; i++)
        {
            let enemy = new Enemy(player);
            enemy.position.copy(new THREE.Vector3(MathUtility.getRandomInt(-15, 15), MathUtility.getRandomInt(-15, 15), 0));
            scene.add(enemy);
        }
        */

        player.position.x = saveData.player.position.x;
        player.position.y = saveData.player.position.y;
        player.position.z = saveData.player.position.z;

        player.rotation.x = saveData.player.rotation.x;
        player.rotation.y = saveData.player.rotation.y;
        player.rotation.z = saveData.player.rotation.z;

        Weather.startRain();

        // TODO: move this out of here later, this is just proof of concept

        const dialog = new DialogTile("What in the god damn? Now it's time for you to die!", new THREE.Vector3(10, 0, 0), new THREE.Vector2(2, 2));
        dialog.position.x = 10;
        scene.add(dialog);

        const chest = new Chest("congration u found trasure");
        chest.position.x = -10;
        scene.add(chest);

        // TODO: load player inventory
        
        console.log("LoadSaveState complete.");

        this.stateMachine.changeState(new PlayState());
    }
    
    cleanup()
    {
        PageUtility.removeStyle("loading");
        
        loadingDiv.remove();
        
        console.log("LoadingState cleaned up.");
    }

    loadTile(tile)
    {
        let newTile = null

        if (tile.type == "basic")
        {

        }
        else if (tile.type == "trigger")
        {
            
        }
    }
};