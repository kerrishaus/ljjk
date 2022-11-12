import { Plane, Raycaster, SphereGeometry, Mesh, MeshPhongMaterial, Vector2, RepeatWrapping, TextureLoader, PlaneGeometry, Vector3, Quaternion, BoxGeometry, MeshStandardMaterial, PerspectiveCamera } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { TransformControls } from 'https://kerrishaus.com/assets/threejs/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'https://kerrishaus.com/assets/threejs/examples/jsm/controls/OrbitControls.js';

import * as GeometryUtil from "./geometry/GeometryUtility.js";

import * as MathUtility from "./MathUtility.js";
import { Actor } from "./Actor.js";

export class Player extends Actor
{
    constructor(camera)
    {
        const geometry = new PlaneGeometry(2, 2);
        const material = new MeshStandardMaterial({ transparent: true });

        super(geometry, material);

        this.addSpriteSheet("player_walk", 2);
        this.addSpriteSheet("player_idle", 2);
        this.setSpriteSheet("player_idle");

        this.camera = camera;

        this.freeControls = new OrbitControls(this.camera, renderer.domElement);
        this.freeControls.target.set(0, 0, 0);
        this.freeControls.update();
        this.freeControls.enabled = false;

        this.MoveType = {
            Mouse: 'Mouse',
            Touch: 'Touch',
            Keyboard: 'Keyboard'
        };

        this.move = null;
        this.keys = new Array();
        this.pointerMoveOrigin = new Vector2();
        this.moving = false;
        
        this.moveTarget = new Mesh(new SphereGeometry(0.25, 24, 8), new MeshPhongMaterial({ color: 0x00ffff, 
                                                                                            flatShading: true,
                                                                                            transparent: true,
                                                                                            opacity: 0.7,
                                                                                        }));

        //scene.add(this.moveTarget);

        this.plane = new Plane(new Vector3(0, 0, 0.5), 0);

        this.mouse = new Vector2();
        this.raycaster = new Raycaster();
        this.intersects = new Vector3();

        this.keys = new Array();

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

            //this.move = this.MoveType.Touch;
        });
        
        window.addEventListener("mousedown", (event) =>
        {
            this.pointerMoveOrigin.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.pointerMoveOrigin.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            //this.move = this.MoveType.Mouse;
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
                this.freeControls.enabled = !this.freeControls.enabled;

                this.camera.position.z = 10;
                this.camera.position.y = -12;
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));

                console.log("FreeCamera has been toggled.");
            }
            else
            {
                switch (event.code)
                {
                    case "KeyW":
                    case "ArrowUp":
                    case "KeyA":
                    case "ArrowLeft":
                    case "KeyS":
                    case "ArrowDown":
                    case "KeyD":
                    case "ArrowRight":
                        this.move = this.MoveType.Keyboard;
                        this.setSpriteSheet("player_walk");
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
                {
                    this.move = null;
                    this.setSpriteSheet("player_idle");
                }
        });

        this.velocity = 0;

        this.maxSpeed = 0.2;
        this.slipperyness = 5;
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);

        $("#playerDelta").text(deltaTime);
        $("#playerMove").text(this.move);

        if (this.freeControls.enabled)
            return;

        if (this.move == this.MoveType.Keyboard ||
            this.move == this.MoveType.Mouse ||
            this.move == this.MoveType.Touch)
        {
            /*
            if (!playerControlsEnabled)
                return;
            */

            if (this.move == this.MoveType.Keyboard)
            {
                const moveAmount = this.maxSpeed;

                if (this.keys["KeyW"] || this.keys["ArrowUp"])
                    this.moveTarget.translateY(moveAmount);
                if (this.keys["KeyA"] || this.keys["ArrowLeft"])
                    this.moveTarget.translateX(-moveAmount);
                if (this.keys["KeyS"] || this.keys["ArrowDown"])
                    this.moveTarget.translateY(-moveAmount);
                if (this.keys["KeyD"] || this.keys["ArrowRight"])
                    this.moveTarget.translateX(moveAmount);
            }
        }

        let position = new Vector2(), target = new Vector2();

        position.x = this.position.x;
        position.y = this.position.y;

        target.x = this.moveTarget.position.x;
        target.y = this.moveTarget.position.y;

        let distance = this.position.distanceTo(this.moveTarget.position);

        // FIXME: without this, the camera is constantly trying to move
        // and causes weird vibrating with a low slipperyness value
        if (distance <= 0.5)
            distance = 0;

        // TODO: slow down diagonal movement
        this.velocity = distance / this.slipperyness;
        this.velocity = MathUtility.clamp(this.velocity, 0, this.maxSpeed);

        // move the player their direction
        this.rotation.z = MathUtility.angleToPoint(position, target);
        this.translateY(this.velocity);
        this.rotation.z = 0;
        
        // position the camera relative to the player
        this.camera.position.x = this.position.x;
        this.camera.position.y = this.position.y;
        this.camera.lookAt(this.position);
    }
};