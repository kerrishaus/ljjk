import { Plane, Raycaster, SphereGeometry, Mesh, MeshPhongMaterial, Vector2, RepeatWrapping, TextureLoader, PlaneGeometry, Vector3, Quaternion, BoxGeometry, MeshStandardMaterial, PerspectiveCamera } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { Player } from "./Player.js";
import { Actor } from "./Actor.js";
import { Enemy } from "./Enemy.js";
import * as MathUtility from "./MathUtility.js";

export class Projectile extends Actor
{
    constructor(target, startingPosition, sprite)
    {
        const geometry = new PlaneGeometry(2, 2);
        const material = new MeshStandardMaterial({ transparent: true });

        super(geometry, material);

        this.position.copy(startingPosition);

        this.addSpriteSheet(sprite, 4);
        this.setSpriteSheet(sprite);

        this.target = target;
    }

    update(deltaTime)
    {
        if (this.position.distanceTo(this.target.position) < 1)
        {
            this.target.health -= 5;
            
            if (this.target instanceof Player)
            {
                $("#health").val(this.target.health);
                
                if (this.target.health <= 0)
                    window.location.reload();
            }

            if (this.target.health <= 0)
            {
                if (this.target instanceof Enemy)
                {
                    let enemy = new Enemy(player);
                    enemy.position.copy(new Vector3(MathUtility.getRandomInt(-15, 15), MathUtility.getRandomInt(-15, 15), 0));
                    scene.add(enemy);

                    if (player.lastAttacker = this.target)
                        player.lastAttacker = null;
                }

                scene.remove(this.target);
            }

            console.log("Boom!");
            scene.remove(this);
        }

        this.position.lerp(this.target.position, 0.25);
    }
}