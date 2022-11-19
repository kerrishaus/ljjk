import { State } from "./State.js";

import * as THREE from "https://kerrishaus.com/assets/threejs/build/three.module.js";
import { GLTFLoader } from 'https://kerrishaus.com/assets/threejs/examples/jsm/loaders/GLTFLoader.js';

import * as MathUtility from "../MathUtility.js";
import * as PageUtility from "../PageUtility.js";

import * as Weather from "../Weather.js";

import { Triggerable } from "../geometry/Triggerable.js";
import { DialogTile } from "../tiles/DialogTile.js";
import { Chest } from "../tiles/Chest.js";


export class PlayState extends State
{
    init()
    {
        PageUtility.addStyle("game");
        PageUtility.addStyle("banner");
        PageUtility.addStyle("interface");
        PageUtility.addStyle("buyMenu");
        PageUtility.addStyle("rain");
        PageUtility.addStyle("dialog/dialogBox");

        $(document.body).append(`
        <div class="interface-container mouse-passthrough">
            <div class='instructions'>
                <p>Use the mouse, WASD or arrow keys to control movement.</p>
                <p>Press <kbd>P</kbd> to disable pixelation.</p>
                <p>Press <kbd>V</kbd> to toggle rigid/smooth movement.</p>
                <p>Press <kbd>O</kbd> to toggle free camera.</p>
            </div>
            <div class='debug'>
                <p>player move: <span id='playerMove'>nil</span></p>
                <p>player move rigid: <span id='playerMoveRigid'>false</span></p>
                <p>player move direction: <span id='playerMoveRigid'>false</span></p>
                <p>player diagonal allowed: <span id='playerMoveDirection'>false</span></p>
                <p>player delta: <span id='playerDelta'>nil</span></p>
            </div>
            <div class='dialog-container no-mouse-passthrough'>
                <div class='dialog-box hidden bottom'>
                    <span class='dialog-message'>
                        If you ever see this text, someone got fired!
                    </span>
                </div>
            </div>
            <div class='player-stats'>
            </div>
        </div>`);

        //$(document.body).append(`<div id="buyMenu" class="display-flex flex-wrap flex-gap" data-visiblity="hidden"></div>`);

        this.clock = new THREE.Clock();

        window.oncontextmenu = (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        /*
        // TODO: don't do this during dev
        window.onbeforeunload = function(event)
        {
            return 'You will lose unsaved progress, are you sure?';
        };
        */

        // below this line is proof of concept for scary game

        const floorGeometry = new THREE.PlaneGeometry(50, 50);

        const floorTexture  = new THREE.TextureLoader().load('textures/terrain/grassdirt-big.png');
        floorTexture.repeat = new THREE.Vector2(3, 3);
        floorTexture.wrapS  = THREE.RepeatWrapping;
        floorTexture.wrapT  = THREE.RepeatWrapping;
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });

        const floor      = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.z = 0;

        scene.add(floor);

        /*
        scene.fog = new THREE.Fog( 0x000000, 0.004, 20 ); 

        const loader = new GLTFLoader();

        for (let i = 0; i < 40; i++)
        {
            loader.load('models/geometry/foliage/tree/scene.gltf', function (gltf)
            {
                gltf.scene.scale.x = 0.1 + Math.random() / 4;
                gltf.scene.scale.y = 0.1 + Math.random() / 4;
                gltf.scene.scale.z = 0.1 + Math.random() / 4;

                gltf.scene.rotation.x = 1.5708;
                //gltf.scene.rotation.y += Math.random();
                //gltf.scene.rotation.z += Math.random();

                gltf.scene.position.x = MathUtility.getRandomInt(-15, 15);
                gltf.scene.position.y = MathUtility.getRandomInt(-15, 15);
                scene.add(gltf.scene);

                console.log("created tree " + i);
            }, undefined, function (error) 
            {
                console.error(error);
            });
        }
        */

        // create an AudioListener and add it to the camera
        const listener = new THREE.AudioListener();
        player.camera.add(listener);

        // create a global audio source
        const ambientMusic = new THREE.Audio(listener);
        const ambientRain = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'audio/music/forest_ambient.mp3', function(buffer)
        {
            ambientMusic.setBuffer( buffer );
            ambientMusic.setLoop( true );
            ambientMusic.setVolume( 0.5 );
            ambientMusic.play();
        });

        audioLoader.load( 'audio/music/rain.mp3', function(buffer)
        {
            ambientRain.setBuffer( buffer );
            ambientRain.setLoop( true );
            ambientRain.setVolume( 0.2 );
            ambientRain.play();
        });

        Weather.startRain();

        // TODO: move this out of here later, this is just proof of concept

        const dialog = new DialogTile("hello my name is tyler", new THREE.Vector3(10, 0, 0), new THREE.Vector2(2, 2));
        dialog.position.x = 10;
        scene.add(dialog);

        const chest = new Chest("congration u found trasure");
        chest.position.x = -10;
        scene.add(chest);

        console.log("PlayState is ready.");

        $(renderer.domElement).show();
        $(htmlRenderer.domElement).show();
        
        this.animate();
    }

    cleanup()
    {
        PageUtility.removeStyle("game");
        PageUtility.removeStyle("banner");
        PageUtility.removeStyle("interface");
        PageUtility.removeStyle("buyMenu");

        window.onbeforeunload = null;

        console.log("Cleaned up PlayState.");
    }

    entityTick(deltaTime)
    {
        scene.children.forEach((object) =>
        {
            if ('update' in object)
                object.update(deltaTime);

            if (object instanceof Triggerable)
            {
                if (player.box.intersectsBox(object.trigger))
                {
                    if (object.triggeringObjects.includes(player))
                        object.onTrigger(player);
                    else
                        object.onStartTrigger(player);
                }
                else if (object.triggeringObjects.includes(player))
                    object.onStopTrigger(player);

                /*
                // TODO: change this to entity
                for (const customer of shop.customers)
                {
                    // customer intersects with Triggerable's trigger
                    if (object.trigger.intersectsBox(customer.box))
                    {
                        // object is not currently triggered by the customer
                        if (!object.triggeringObjects.includes(customer))
                            object.onTrigger(customer);
                    }
                    // customer is not intersecting with this trigger
                    else
                    {
                        // if this trigger is triggered by the customer, stop triggering
                        if (object.triggeringObjects.includes(customer))
                            object.onStopTrigger(customer);
                    }
                }
                */
            }
        });
    }
    
    animate()
    {
        window.currentRequestFrame = requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        
        if (physicsUpdatesEnabled)
            scene.physicsTick(deltaTime);

        if (entityUpdatesEnabled)
            this.entityTick(deltaTime);

        if (renderUpdatesEnabled)
        {
            /*
            if (mixer)
                mixer.update(deltaTime);
            */
            
            composer.render();
            htmlRenderer.render(scene, player.camera);
        }
    };
}
