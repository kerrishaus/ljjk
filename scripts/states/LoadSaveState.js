import { State } from "./State.js";

import * as THREE from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { CSS2DRenderer } from "https://kerrishaus.com/assets/threejs/examples/jsm/renderers/CSS2DRenderer.js";

import * as PageUtility from "../PageUtility.js";

import { PlayState } from "./PlayState.js";
import { Player } from "../Player.js";
import * as SaveLoader from "../SaveLoader.js";
import { Tile } from "../tiles/Tile.js";

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

        player.position.x = saveData.player.position.x;
        player.position.y = saveData.player.position.y;
        player.position.z = saveData.player.position.z;

        player.rotation.x = saveData.player.rotation.x;
        player.rotation.y = saveData.player.rotation.y;
        player.rotation.z = saveData.player.rotation.z;

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