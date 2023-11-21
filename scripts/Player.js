import { Plane, Raycaster, SphereGeometry, Mesh, MeshPhongMaterial, Vector2, PlaneGeometry, Vector3, MeshStandardMaterial } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { OrbitControls } from 'https://kerrishaus.com/assets/threejs/examples/jsm/controls/OrbitControls.js';

import * as MathUtility from "./MathUtility.js";

import { Projectile } from "./Projectile.js";
import { Enemy } from "./Enemy.js";
import { Actor } from "./Actor.js";

export class Player extends Actor
{
    constructor(camera)
    {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshStandardMaterial({ transparent: true });

        super(geometry, material);

        this.addSpriteSheet("player_walk", 2);
        this.addSpriteSheet("player_idle", 2);
        this.setSpriteSheet("player_idle");

        this.camera = camera;

        this.freeControls = new OrbitControls(this.camera, renderer.domElement);
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
        this.moveDirection = null;

        this.rigidMovementEnabled = false;
        this.diagonalMovementEnabled = true;

        this.MoveDirections = {
            North: "North",
            NorthEast: "NorthEast",
            East: "East",
            SouthEast: "SouthEast",
            South: "South",
            SouthWest: "SouthWest",
            West: "West",
            NorthWest: "NorthWest"
        };
        
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

        window.addEventListener("mousemove", (event) =>
        {
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        });
        
        window.addEventListener("touchmove", (event) =>
        {
            this.mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;

            if (this.move == this.MoveType.Mouse)
            {

            }
        });

        window.addEventListener("touchstart", (event) =>
        {
            // on mobile, you want to emulate a joystick to control player movement
            // so we set the location where the finger was first placed
            // the move direction is relative to where the touch was initiated from
            this.pointerMoveOrigin.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
            this.pointerMoveOrigin.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;

            //this.move = this.MoveType.Touch;
        });
        
        window.addEventListener("mousedown", (event) =>
        {
            // TODO: i think this should be the middle of the screen
            // when you use the mouse to move, you expect it to be relative to the character's position on screen
            // as if you were telling him to go where you clicked
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

                console.log(`Toggle free camera: ${this.freeControls.enabled}`);
            }
            else if (event.code == "KeyV")
            {
                this.rigidMovementEnabled = !this.rigidMovementEnabled;

                console.log(`Toggled rigid movement: ${this.rigidMovementEnabled}`);
            }
            /*
            else if (event.code == "KeyC")
            {
                this.diagonalMovementEnabled = !this.diagonalMovementEnabled;

                console.log(`Toggled diagonal movement: ${this.diagonalMovementEnabled}`);
            }
            */
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
                    this.moveDirection = null;
                    this.setSpriteSheet("player_idle");
                }
        });

        this.velocity = 0;

        this.maxSpeed = 0.2;
        this.slipperyness = 5;
        this.cameraHeight = 10;

        this.health = 100;

        this.lastAttacker = null;

        this.timeSinceLastProjectile = 10;
    }
    
    update(deltaTime)
    {
        super.update(deltaTime);

        $("#playerDelta").text(deltaTime);
        $("#playerMove").text(this.move || "none");
        $("#playerMoveRigid").text(this.rigidMovementEnabled);
        $("#playerMoveDirection").text(this.moveDirection || "none");

        if (this.freeControls.enabled)
        {
            this.freeControls.update();
            return;
        }

        if (this.keys["Space"] && this.lastAttacker instanceof Enemy)
        {
            if (this.timeSinceLastProjectile > 0.3)
            {
                const distanceFromPlayer = this.position.distanceTo(this.lastAttacker.position);

                const COMBAT_RANGE = 6;
        
                // if the player is close enough to be targetted
                if (distanceFromPlayer < COMBAT_RANGE)
                {
                    console.debug("Fired at enemy.");
                    
                    scene.add(new Projectile(this.lastAttacker, this.position, "blue_orb"));
                    
                    this.timeSinceLastProjectile = 0;
                }
            }

            this.timeSinceLastProjectile += deltaTime;
        }

        if (this.move)
        {
            // TODO: i would prefer this be done in the key press events,
            // but it's a little complicated to do that right now, so since
            // this works, i'm going to keep it here for now /kenny
            if (this.move == this.MoveType.Keyboard)
            {
                if (this.keys["KeyW"])
                {
                    if (this.keys["KeyA"])
                        this.moveDirection = this.MoveDirections.NorthWest;
                    else if (this.keys["KeyD"])
                        this.moveDirection = this.MoveDirections.NorthEast;
                    else
                        this.moveDirection = this.MoveDirections.North;
                }
                if (this.keys["KeyA"])
                {
                    if (this.keys["KeyW"])
                        this.moveDirection = this.MoveDirections.NorthWest;
                    else if (this.keys["KeyS"])
                        this.moveDirection = this.MoveDirections.SouthWest;
                    else
                        this.moveDirection = this.MoveDirections.West;
                }
                if (this.keys["KeyS"])
                {
                    if (this.keys["KeyA"])
                        this.moveDirection = this.MoveDirections.SouthWest;
                    else if (this.keys["KeyD"])
                        this.moveDirection = this.MoveDirections.SouthEast;
                    else
                        this.moveDirection = this.MoveDirections.South;
                }
                if (this.keys["KeyD"])
                {
                    if (this.keys["KeyW"])
                        this.moveDirection = this.MoveDirections.NorthEast;
                    else if (this.keys["KeyS"])
                        this.moveDirection = this.MoveDirections.SouthEast;
                    else
                        this.moveDirection = this.MoveDirections.East;
                }
            }

            switch (this.moveDirection)
            {
                case this.MoveDirections.North:
                    this.moveTarget.translateY(this.maxSpeed);
                    break;
                case this.MoveDirections.NorthEast:
                    this.moveTarget.translateY(this.maxSpeed / 1.5);
                    this.moveTarget.translateX(this.maxSpeed / 1.5);
                    break;
                case this.MoveDirections.NorthWest:
                    this.moveTarget.translateY(this.maxSpeed / 1.5);
                    this.moveTarget.translateX(-this.maxSpeed / 1.5);
                    break;
                case this.MoveDirections.South:
                    this.moveTarget.translateY(-this.maxSpeed);
                    break;
                case this.MoveDirections.SouthEast:
                    this.moveTarget.translateY(-this.maxSpeed / 1.5);
                    this.moveTarget.translateX(this.maxSpeed / 1.5);
                    break;
                case this.MoveDirections.SouthWest:
                    this.moveTarget.translateY(-this.maxSpeed / 1.5);
                    this.moveTarget.translateX(-this.maxSpeed / 1.5);
                    break;
                case this.MoveDirections.East:
                    this.moveTarget.translateX(this.maxSpeed);
                    break;
                case this.MoveDirections.West:
                    this.moveTarget.translateX(-this.maxSpeed);
                    break;
            };
        }

        if (!this.rigidMovementEnabled)
        {
            let position = new Vector2(), target = new Vector2();

            position.x = this.position.x;
            position.y = this.position.y;

            target.x = this.moveTarget.position.x;
            target.y = this.moveTarget.position.y;

            let distance = this.position.distanceTo(this.moveTarget.position);

            // apparently this isn't needed anymore?
            /*
            // FIXME: without this, the camera is constantly trying to move
            // and causes weird vibrating with a low slipperyness value
            if (distance <= 0.1)
                distance = 0;
            */

            // TODO: slow down diagonal movement
            this.velocity = distance / this.slipperyness;
            this.velocity = MathUtility.clamp(this.velocity, 0, this.maxSpeed);

            // move the player their direction by temporarily
            // changing the player rotation to face the moveTarget,
            // moving them the velocity towards the movetarget,
            // and then setting their rotation back to zero
            this.rotation.z = MathUtility.angleToPoint(position, target);
            this.translateY(this.velocity);
            this.rotation.z = 0;
        }
        else
            this.position.copy(this.moveTarget.position);
        
        // position the camera relative to the player
        this.camera.position.x = this.position.x;
        this.camera.position.y = this.position.y;
        this.camera.position.z = this.position.z + this.cameraHeight;
        this.camera.lookAt(this.position);

        this.timeSinceLastProjectile += deltaTime;
    }
};