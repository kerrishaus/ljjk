import { Plane, Raycaster, SphereGeometry, Mesh, MeshPhongMaterial, Vector2, RepeatWrapping, TextureLoader, PlaneGeometry, Vector3, Quaternion, BoxGeometry, MeshStandardMaterial, PerspectiveCamera } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { TransformControls } from 'https://kerrishaus.com/assets/threejs/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'https://kerrishaus.com/assets/threejs/examples/jsm/controls/OrbitControls.js';

import { ItemCarrier } from "./ItemCarrier.js";

import * as GeometryUtil from "./geometry/GeometryUtility.js";

import * as MathUtility from "./MathUtility.js";

export class Player extends ItemCarrier
{
    constructor(camera)
    {
        const geometry = new PlaneGeometry(2, 2);

        const spriteSheet = new TextureLoader().load('textures/sprites/player.png');

        spriteSheet.wrapS = RepeatWrapping;
        spriteSheet.wrapT = RepeatWrapping;
        spriteSheet.repeat.set(0.058, 1);

        spriteSheet.anisotropy = renderer.capabilities.getMaxAnisotropy();

        spriteSheet.rotation = 1.5708;

        const material = new MeshStandardMaterial({ map: spriteSheet, transparent: true });

        super(geometry, material);

        this.spriteSheet = spriteSheet;

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
        this.pointerMove = false;
        
        this.moveTarget = new Mesh(new SphereGeometry(0.25, 24, 8), new MeshPhongMaterial({ color: 0x00ffff, 
                                                                                            flatShading: true,
                                                                                            transparent: true,
                                                                                            opacity: 0.7,
                                                                                        }));

        scene.add(this.moveTarget);

        this.plane = new Plane(new Vector3(0, 0, 0.5), 0);

        this.mouse = new Vector2();
        this.raycaster = new Raycaster();
        this.intersects = new Vector3();

        this.keys = new Array();

        window.addEventListener("keydown", (event) =>
        {
            this.keys[event.code] = true;

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
                    this.moveTarget.quaternion.copy(this.quaternion);
                    break;
            };
        });
        
        window.addEventListener("keyup", (event) =>
        {
            this.keys[event.code] = false;

            if (!(this.keys["KeyW"] || this.keys["ArrowUp"] ||
                  this.keys["KeyA"] || this.keys["ArrowLeft"] ||
                  this.keys["KeyS"] || this.keys["ArrowDown"] ||
                  this.keys["KeyD"] || this.keys["ArrowRight"]))
                    player.move = null;
        });

        this.maxSpeed = 0.3;
        this.spriteUpdateTime = 0.25; // in seconds
        this.timeSinceLastSpriteUpdate = 0;
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);

        /*
        if (this.move)
        {
            this.timeSinceLastSpriteUpdate += deltaTime;

            if (this.timeSinceLastSpriteUpdate > this.spriteUpdateTime)
            {
                this.spriteSheet.offset.x += 0.0586;

                this.timeSinceLastSpriteUpdate = 0;
            }
        }
        */

        $("#playerDelta").text(deltaTime);
        $("#playerMove").text(this.move);

        /*
        if (this.freeControls.enabled)
            return;
        */

        if (this.move == this.MoveType.Keyboard ||
            this.move == this.MoveType.Mouse ||
            this.move == this.MoveType.Touch)
        {
            /*
            if (!playerControlsEnabled)
                return;
            */

            let position = new Vector2(), target = new Vector2();
            let velocity = 0;

            if (this.move == this.MoveType.Touch)
            {
                position = this.pointerMoveOrigin;
                target = this.mouse;

                if (this.mouse.x > window.innerWidth / 2)
                    console.log("left side mouse");

                velocity = this.pointerMoveOrigin.distanceTo(new Vector3(this.mouse.x, this.mouse.y)) / 2;
            }
            else
            {
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

                    this.moveTarget.quaternion.copy(this.quaternion);
                }
                else if (this.move == this.MoveType.Mouse)
                {
                    this.raycaster.setFromCamera(this.mouse, this.camera);
                    this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                    this.moveTarget.position.copy(this.intersects);
                }

                position.x = this.position.x;
                position.y = this.position.y

                target.x = this.moveTarget.position.x;
                target.y = this.moveTarget.position.y;

                velocity = this.position.distanceTo(this.moveTarget.position) / 20;
            }

            // set the player's direction
            //this.rotation.z = Math.atan2(y2 - y1, x2 - x1) - 1.5708;
            this.rotation.z = MathUtility.angleToPoint(position, target);

            // clamp the player's velocity
            velocity = MathUtility.clamp(velocity, 0, this.maxSpeed);

            // move the player their direction
            this.translateY(velocity);

            // position the camera relative to the player
            this.camera.position.x = this.position.x;
            this.camera.position.y = this.position.y;
            this.camera.lookAt(this.position);
        }
    }
};