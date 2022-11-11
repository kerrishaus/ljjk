import { State } from "./State.js";

import * as THREE from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { GLTFLoader } from 'https://kerrishaus.com/assets/threejs/examples/jsm/loaders/GLTFLoader.js';

import * as MathUtility from "../MathUtility.js";
import * as PageUtility from "../PageUtility.js";

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
        PageUtility.addStyle("dialog/dialogBox");

        $(document.body).append(`
        <div class="interface-container">
            <div class='instructions'>
                <p>Use the mouse, WASD or arrow keys to control movement.</p>
                <p>Press P to disable pixelation.</p>
                <p>Press O to toggle free camera.</p>
            </div>
            <div class='debug'>
                <p>player move: <span id='playerMove'>nil</span></p>
                <p>player delta: <span id='playerDelta'>nil</span></p>
            </div>
            <div class='dialog-container'>
                <div class='dialog-box hidden bottom'>
                    <span class='dialog-message'>
                        If you ever see this text, someone got fired!
                    </span>
                </div>
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

        window.addEventListener("mousemove", (event) =>
        {
            player.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            player.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        });
        
        window.addEventListener("touchmove", (event) =>
        {
            player.mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            player.mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
        });

        window.addEventListener("touchstart", (event) =>
        {
            player.pointerMoveOrigin.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            player.pointerMoveOrigin.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;

            player.move = player.MoveType.Touch;
        });
        
        window.addEventListener("mousedown", (event) =>
        {
            player.pointerMoveOrigin.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            player.pointerMoveOrigin.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            player.move = player.MoveType.Mouse;
        });

        $(window).on('mouseup touchend', (event) =>
        {
            player.move = null;
        });

        window.addEventListener("keydown", (event) =>
        {
            if (event.code == "KeyO")
            {
                player.freeControls.enabled = !player.freeControls.enabled;

                player.camera.position.z = 10;
                player.camera.position.y = -12;
                player.camera.lookAt(new THREE.Vector3(0, 0, 0));

                console.log("FreeCamera has been toggled.");
            }
            else if (event.code == "KeyP")
            {
                pixelPass.enabled = !pixelPass.enabled;
            }
        });

        /*
        // TODO: don't do this during dev
        window.onbeforeunload = function(event)
        {
            return 'You will lose unsaved progress, are you sure?';
        };
        */

        // below this line is proof of concept for scary game

        const floorGeometry = new THREE.BoxGeometry(50, 50, 1);

        const floorTexture  = new THREE.TextureLoader().load('textures/terrain/grassdirt-big.png');
        floorTexture.repeat = new THREE.Vector2(3, 3);
        floorTexture.wrapS  = THREE.RepeatWrapping;
        floorTexture.wrapT  = THREE.RepeatWrapping;
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });

        const floor      = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.z = -1;

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
        camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'audio/music/forest_ambient.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });

        // TODO: move this out of here later, this is just proof of concept

        const dialog = new DialogTile("hello my name is tyler", 50, new THREE.Vector3(10, 0, 0), new THREE.Vector2(2, 2));
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

    physicsTick(deltaTime)
    {
        physicsWorld.stepSimulation(deltaTime, 10);

        for (const object of physicsBodies)
        {
            object.motionState.getWorldTransform(tmpTransform);

            const pos = tmpTransform.getOrigin();
            const quat = tmpTransform.getRotation();
            const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
            const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());
            
            object.position.copy(pos3);
            object.quaternion.copy(quat3);
        }

        this.checkCollisions();
    }

    checkCollisions()
    {
        let dispatcher = physicsWorld.getDispatcher();
        let numManifolds = dispatcher.getNumManifolds();

        for (let i = 0; i < numManifolds; i++)
        {
            let contactManifold = dispatcher.getManifoldByIndexInternal(i);
            let numContacts = contactManifold.getNumContacts();

            for (let j = 0; j < numContacts; j++)
            {
                let contactPoint = contactManifold.getContactPoint(j);
                let distance = contactPoint.getDistance();

                if (distance > 0.0)
                    continue;

                console.log({ manifoldIndex: i, contactIndex: j, distance: distance });
            }
        }
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

        /*
        if (playerControlsEnabled)
            this.playerMovement(deltaTime);
        */

        if (entityUpdatesEnabled)
            this.entityTick(deltaTime);

        if (physicsUpdatesEnabled)
            this.physicsTick(deltaTime);

        /*
        if (playerControlsEnabled && freeControls.enabled)
            freeControls.update();
        */

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