import { Scene } from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { PhysicsMesh } from "./geometry/PhysicsMesh.js";

export class PhysicsScene extends Scene
{
    constructor()
    {
        super();
    }

    add(object)
    {
        super.add(object);

        if (object instanceof PhysicsMesh)
        {
            physicsBodies.push(object);
            physicsWorld.addRigidBody(object.body);
        }
    }

    remove(object)
    {
        super.remove(object);

        if (object instanceof PhysicsMesh)
        {
            // remove from physicsBodies
            // remove from physicsWorld

            console.error("Remove physics bodies from the scene!");
        }
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

                //console.log({ manifoldIndex: i, contactIndex: j, distance: distance });
            }
        }
    }
}

