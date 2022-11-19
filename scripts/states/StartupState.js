import { State } from "./State.js";

import * as THREE from "https://kerrishaus.com/assets/threejs/build/three.module.js";

import { EffectComposer } from "https://kerrishaus.com/assets/threejs/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from 'https://kerrishaus.com/assets/threejs/examples/jsm/postprocessing/RenderPass.js';

import { UnrealBloomPass } from 'https://kerrishaus.com/assets/threejs/examples/jsm/postprocessing/UnrealBloomPass.js';

import { ShaderPass } from "https://kerrishaus.com/assets/threejs/examples/jsm/postprocessing/ShaderPass.js";

import { GLTFLoader } from 'https://kerrishaus.com/assets/threejs/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://kerrishaus.com/assets/threejs/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'https://kerrishaus.com/assets/threejs/examples/jsm/environments/RoomEnvironment.js';

import { CSS2DRenderer } from "https://kerrishaus.com/assets/threejs/examples/jsm/renderers/CSS2DRenderer.js";

import AmmoLib from "https://kerrishaus.com/assets/ammojs/ammo.module.js";

import { PhysicsScene } from "../PhysicsScene.js";

import * as PageUtility from "../PageUtility.js";

import { LoadSaveState } from "./LoadSaveState.js";

export class StartupState extends State
{
    init(stateMachine)
    {
        this.stateMachine = stateMachine;

        PageUtility.addStyle("loading");

        this.loadingDiv = document.createElement("div");
        this.loadingDiv.id = "loadingDiv";
        this.loadingDiv.classList = "display-flex align-center justify-center";
        this.loadingDiv.textContent = "Loading...";
        document.body.appendChild(this.loadingDiv);

        window.collisionConfiguration_ = null;
        window.dispatcher_ 			   = null;
        window.broadphase_             = null;
        window.solver_				   = null;
        window.physicsWorld            = null;
        window.physicsBodies 		   = new Array();
        window.tmpTransform 		   = null;
        
        function prepareThree()
        {
            console.log("Preparing Three.");

            window.renderer = new THREE.WebGLRenderer({
                antialias: true,
                shadowMap: true
            });
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            $(renderer.domElement).hide();

            window.htmlRenderer = new CSS2DRenderer();
            htmlRenderer.setSize(window.innerWidth, window.innerHeight);
            htmlRenderer.domElement.style.position = 'absolute';
            htmlRenderer.domElement.style.top = '0px';
            document.body.appendChild(htmlRenderer.domElement).style.pointerEvents = "none";
            $(htmlRenderer.domElement).hide();

            window.scene = new PhysicsScene(); // TODO: FIXME: I don't really feel great about this, but it works, so it stays.
            
            const light2 = new THREE.AmbientLight(0xaaaaaa);
            scene.add(light2);
            
            window.addEventListener('resize', (event) =>
            {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                console.log("Window resized.");
            });

            window.renderUpdatesEnabled  = true;
            window.entityUpdatesEnabled  = true;
            window.physicsUpdatesEnabled = true;

            window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
            camera.position.z = 10;
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            window.composer = new EffectComposer(renderer);
            
            composer.addPass(new RenderPass(scene, camera));

            //composer.addPass(new UnrealBloomPass(new THREE.Vector2(2048, 2048), 1, 0.4, 0.8));

            console.log("Three is ready.");
        }

        function prepareAmmo(lib)
        {
            console.log("Preparing Ammo.");

            let Ammo = lib;
            window.Ammo = lib;

            collisionConfiguration_ = new Ammo.btDefaultCollisionConfiguration();
            dispatcher_  			= new Ammo.btCollisionDispatcher(collisionConfiguration_);
            broadphase_  			= new Ammo.btDbvtBroadphase();
            solver_      			= new Ammo.btSequentialImpulseConstraintSolver();
            physicsWorld 			= new Ammo.btDiscreteDynamicsWorld(dispatcher_, broadphase_, solver_, collisionConfiguration_);
            physicsWorld.setGravity(new Ammo.btVector3(0, 0, -100));

            tmpTransform = new Ammo.btTransform();

            console.log("Ammo is ready.");
        }

        window.addEventListener('DOMContentLoaded', async () =>
        {
            AmmoLib().then((lib) =>
            {
                prepareThree();
                prepareAmmo(lib);

                //this.stateMachine.changeState(new MainMenuState());
                this.stateMachine.changeState(new LoadSaveState());
            });
        });
        
        console.log("LoadingState ready.");
    }
    
    cleanup()
    {
        PageUtility.removeStyle("loading");
        
        loadingDiv.remove();
        
        console.log("LoadingState cleaned up.");
    }
};
