import { State } from "./State.js";

import * as PageUtility from "../PageUtility.js";

import { PlayState } from "./PlayState.js";
import { SettingsState } from "./SettingsState.js";

export class MainMenuState extends State
{
    init(stateMachine)
    {
        this.stateMachine = stateMachine;

        PageUtility.addStyle("mainMenu");

        this.mainMenu = document.createElement("div");
        this.mainMenu.id = "mainMenu";
        this.mainMenu.classList = "display-flex justify-center align-center flex-column flex-gap";
        document.body.appendChild(this.mainMenu);

        this.mainMenu.appendChild(`
        <div class='.credits'>
            OpenGameArt 
            https://opengameart.org/content/twelve-16x18-rpg-sprites-plus-base
            https://opengameart.org/content/town-tiles

            Three.js
            https://threejs.org/
        </div>`)

        console.log("MainMenuState ready.");
    }

    cleanup()
    {
        PageUtility.removeStyle("mainMenu");

        this.mainMenu.remove();

        console.log("MainMenuState cleaned up.");
    }
};