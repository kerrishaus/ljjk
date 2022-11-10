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
            <div class='dialog-container'>
                <div class='dialog-box hidden bottom'>
                    <span class='dialog-message'>
                        If you ever see this text, someone got fired!
                    </span>
                </div>
            </div>
        </div>`);

        //$(document.body).append(`<div id="buyMenu" class="display-flex flex-wrap flex-gap" data-visiblity="hidden"></div>`);

        this.MoveType = {
            Mouse: 'Mouse',
            Touch: 'Touch',
            Keyboard: 'Keyboard'
        };

        this.move = null;
        this.keys = new Array();
        this.pointerMoveOrigin = new THREE.Vector2();
        this.moving = false;
        this.pointerMove = false;
        
        this.moveTarget = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 8), new THREE.MeshPhongMaterial({ color: 0x00ffff, 
                                                                                                             flatShading: true,
                                                                                                             transparent: true,
                                                                                                             opacity: 0.7,
                                                                                                            }));

        scene.add(this.moveTarget);                                                                                                            
        
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 0.5), 0);

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.intersects = new THREE.Vector3();
        
        this.clock = new THREE.Clock();

        window.oncontextmenu = (event) =>
        {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        window.addEventListener("mousemove", (event) =>
        {
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        });
        
        window.addEventListener("touchmove", (event) =>
        {
            this.mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
        });

        window.addEventListener("touchstart", (event) =>
        {
            this.pointerMoveOrigin.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            this.pointerMoveOrigin.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;

            this.move = this.MoveType.Touch;
        });
        
        window.addEventListener("mousedown", (event) =>
        {
            this.pointerMoveOrigin.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.pointerMoveOrigin.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            this.move = this.MoveType.Mouse;
        });

        $(window).on('mouseup touchend', (event) =>
        {
            this.move = null;
        });

        window.addEventListener("keydown", (event) =>
        {
            this.keys[event.code] = true;

            if (event.code == "KeyO")
            {
                freeControls.enabled = !freeControls.enabled;

                camera.position.z = 10;
                camera.position.y = -12;
                camera.lookAt(new THREE.Vector3(0, 0, 0));

                console.log("FreeCamera has been toggled.");
            }
            else if (event.code == "KeyP")
            {
                pixelPass.enabled = !pixelPass.enabled;
            }
            else
            {
                switch (event.code)
                {
                    case "KeyB":
                        if ($("#buyMenu").attr("data-visiblity") == "shown")
                            $("#buyMenu").attr("data-visiblity", "hidden");
                        else
                            $("#buyMenu").attr("data-visiblity", "shown");
                        break;
                    case "KeyW":
                    case "ArrowUp":
                    case "KeyA":
                    case "ArrowLeft":
                    case "KeyS":
                    case "ArrowDown":
                    case "KeyD":
                    case "ArrowRight":
                        this.move = this.MoveType.Keyboard;
                        this.moveTarget.quaternion.copy(player.quaternion);
                        break;
                };
            }
        });
        
        window.addEventListener("keyup", (event) =>
        {
            this.keys[event.code] = false;

            if (!(this.keys["KeyW"] || this.keys["ArrowUp"] ||
                  this.keys["KeyA"] || this.keys["ArrowLeft"] ||
                  this.keys["KeyS"] || this.keys["ArrowDown"] ||
                  this.keys["KeyD"] || this.keys["ArrowRight"]))
                  this.move = null;
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

        const floorTexture = new THREE.TextureLoader().load('textures/terrain/grassdirt-big.png');
        floorTexture.repeat = new THREE.Vector2(3, 3);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });

        const floor         = new THREE.Mesh(floorGeometry, floorMaterial);
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
        camera.add( listener );

        // create a global audio source
        const sound = new THREE.Audio( listener );

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'audio/music/forest_ambient.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });

        // TODO: move this out of here later, this is just proof of concept

        const dialog = new DialogTile("hello i am dialog2", 50, new THREE.Vector2(10, 0), new THREE.Vector2(10, 10));
        dialog.position.x = 10;

        scene.add(dialog);

        const chest = new Chest("congration u found trasure");
        chest.position.x = -10;

        scene.add(chest);

        const map = new THREE.TextureLoader().load( 'sprite.png' );
        const material = new THREE.SpriteMaterial( { map: map } );

        const sprite = new THREE.Sprite( material );
        scene.add( sprite );

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

    playerMovement(deltaTime)
    {
        if (freeControls.enabled)
            return;

        if (this.move === null)
            return;

        if (!playerControlsEnabled)
            return;

        let position = new THREE.Vector2(), target = new THREE.Vector2();
        let velocity = 0;

        if (this.move == this.MoveType.Touch)
        {
            position = this.pointerMoveOrigin;
            target = this.mouse;

            velocity = this.pointerMoveOrigin.distanceTo(new THREE.Vector3(this.mouse.x, this.mouse.y)) / 2;
        }
        else
        {
            if (this.move == this.MoveType.Keyboard)
            {
                const moveAmount = player.maxSpeed;

                if (this.keys["KeyW"] || this.keys["ArrowUp"])
                    this.moveTarget.translateY(moveAmount);
                if (this.keys["KeyA"] || this.keys["ArrowLeft"])
                    this.moveTarget.translateX(-moveAmount);
                if (this.keys["KeyS"] || this.keys["ArrowDown"])
                    this.moveTarget.translateY(-moveAmount);
                if (this.keys["KeyD"] || this.keys["ArrowRight"])
                    this.moveTarget.translateX(moveAmount);

                this.moveTarget.quaternion.copy(player.quaternion);
            }
            else if (this.move == this.MoveType.Mouse)
            {
                this.raycaster.setFromCamera(this.mouse, camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                this.moveTarget.position.copy(this.intersects);
            }

            position.x = player.position.x;
            position.y = player.position.y

            target.x = this.moveTarget.position.x;
            target.y = this.moveTarget.position.y;

            velocity = player.position.distanceTo(this.moveTarget.position) / 20;
        }

        // set the player's direction
        //player.rotation.z = Math.atan2(y2 - y1, x2 - x1) - 1.5708;
        player.rotation.z = MathUtility.angleToPoint(position, target);

        // clamp the player's velocity
        velocity = MathUtility.clamp(velocity, 0, player.maxSpeed);

        // move the player their direction
        player.translateY(velocity);

        // face the camera at the player
        camera.position.x = player.position.x;
        camera.position.y = player.position.y;
        camera.lookAt(player.position);
    }

    entityTick(deltaTime)
    {
        // TODO: remove this
        player.move = this.move;

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

        if (playerControlsEnabled)
            this.playerMovement(deltaTime);

        if (entityUpdatesEnabled)
            this.entityTick(deltaTime);

        if (physicsUpdatesEnabled)
            this.physicsTick(deltaTime);

        if (playerControlsEnabled && freeControls.enabled)
            freeControls.update();

        if (renderUpdatesEnabled)
        {
            /*
            if (mixer)
                mixer.update(deltaTime);
            */
            
            composer.render();
            htmlRenderer.render(scene, camera);
        }
    };
}