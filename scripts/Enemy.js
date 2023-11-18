import { Plane, Raycaster, SphereGeometry, Mesh, MeshPhongMaterial, Vector2, RepeatWrapping, TextureLoader, PlaneGeometry, Vector3, Quaternion, BoxGeometry, MeshStandardMaterial, PerspectiveCamera } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { TransformControls } from 'https://kerrishaus.com/assets/threejs/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'https://kerrishaus.com/assets/threejs/examples/jsm/controls/OrbitControls.js';

import * as GeometryUtil from "./geometry/GeometryUtility.js";

import * as MathUtility from "./MathUtility.js";
import { Actor } from "./Actor.js";

export class Enemy extends Actor
{
    constructor(player)
    {
        const geometry = new PlaneGeometry(2, 2);
        const material = new MeshStandardMaterial({ transparent: true });

        super(geometry, material);

        this.addSpriteSheet("player_walk", 2);
        this.addSpriteSheet("player_idle", 2);
        this.setSpriteSheet("player_idle");

        this.target = player;

        this.targetPosition = this.position.clone();
    }

    update(deltaTime)
    {
        const distanceFromPlayer = this.position.distanceTo(player.position);

        // if the player is close enough to be targetted
        if (distanceFromPlayer < 8)
            // if the player is too far away to hit
            if (distanceFromPlayer > 3)
                this.targetPosition.copy(player.position);

        this.position.lerp(this.targetPosition, 0.01);
    }
}