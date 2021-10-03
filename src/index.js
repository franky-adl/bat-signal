import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import { addAmbientLighting, addSky, dumpObject, createSpotLight, createSpotLightRepr, createCylinder } from './common';
import { addCameraGUI, updateCameraLookat } from './dat-gui';
import BatmanLogo from './gltf/out.glb'

let camera, scene, canvas, cameraControls, renderer

init()
animate()
addCameraGUI(camera)

function init() {
  scene = new THREE.Scene();
  canvas = document.querySelector("#canvas");
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set( 97, -84, 155 );
  cameraControls = new OrbitControls( camera, canvas );
  cameraControls.target.set( 106, 58, 44 );
  cameraControls.maxDistance = 400;
  cameraControls.minDistance = 10;
  cameraControls.update();

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add lighting to the scene
  addAmbientLighting(scene);

  addSky(scene);

  // load the gltf models
  const loader = new GLTFLoader();
  loader.load( BatmanLogo, function ( gltf ) {
    const root = gltf.scene
    root.rotateX(Math.PI/2) // axis correction
    scene.add( root )
    console.log(dumpObject(root).join('\n'))

    let logo = root.getObjectByName("Batman_Logo")

    logo.position.set(0, -0.4, -8)
    logo.rotation.set(-Math.PI/2, 0, 0)
    logo.children[0].castShadow = true //default is false
    logo.children[0].receiveShadow = false //default

    let light = createSpotLight()
    let light_representation = createSpotLightRepr()
    let cylinder = createCylinder()
    
    const batSignal = new THREE.Group()
    batSignal.add( light )
    batSignal.add( light.target )
    batSignal.add( light_representation )
    batSignal.add( logo )
    batSignal.add(cylinder)

    batSignal.position.set(130, 0, 50)
    batSignal.rotation.set(Math.PI*3/9, Math.PI*2/9, 0)

    scene.add( batSignal )
  } );
}

// Animate the scene
function animate() {
  updateCameraLookat(cameraControls)

  renderer.render( scene, camera );

  requestAnimationFrame( animate );
};