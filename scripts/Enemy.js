import { PlaneGeometry, MeshStandardMaterial } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { Projectile } from "./Projectile.js";
import { Actor } from "./Actor.js";

export class Enemy extends Actor
{
    constructor(player)
    {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshStandardMaterial({ transparent: true });

        super(geometry, material);

        this.addSpriteSheet("player_walk", 2);
        this.addSpriteSheet("player_idle", 2);
        this.setSpriteSheet("player_idle");

        this.target = player;

        this.targetPosition = this.position.clone();

        this.timeSinceLastProjectile = 10;

        this.health = 20;
    }

    update(deltaTime)
    {
        super.update(deltaTime);

        const distanceFromPlayer = this.position.distanceTo(player.position);

        const VISUAL_RANGE = 10;
        const COMBAT_RANGE = 6;

        // if the player is close enough to be targetted
        if (distanceFromPlayer < VISUAL_RANGE)
        {
            // if the player is too far away to hit
            if (distanceFromPlayer > COMBAT_RANGE)
                this.targetPosition.copy(player.position);
            else // the player is within range
            {
                if (this.timeSinceLastProjectile > 5)
                {
                    console.log("Firing projectile at player.");
                    this.timeSinceLastProjectile = 0;

                    const projectile = new Projectile(player, this.position, "purple_orb");

                    scene.add(projectile);
                }

                player.lastAttacker = this;
            }

            this.position.lerp(this.targetPosition, 0.01);
        }

        this.timeSinceLastProjectile += deltaTime;
    }
}