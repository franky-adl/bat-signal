import * as THREE from 'three'

import SKY from './texture/nightsky.jpg'

export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─'
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`)
  const newPrefix = prefix + (isLast ? '  ' : '│ ')
  const lastNdx = obj.children.length - 1
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx
    dumpObject(child, lines, isLast, newPrefix)
  });
  return lines
}

export function addAmbientLighting(scene) {
  const mainLight = new THREE.AmbientLight( 0xffffff, 0.9 )
  scene.add( mainLight )
}

export function createSpotLight() {
  //Create a SpotLight and turn on shadows for the light
  const light = new THREE.SpotLight( 0xffffff, 2 )
  light.castShadow = true // default false
  light.position.set(0, 0, 10)
  light.target.position.set(0, 0, 0)
  light.angle = Math.PI/14
  light.penumbra = 0.35

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512 // default
  light.shadow.mapSize.height = 512 // default
  light.shadow.camera.near = 0.5 // default
  light.shadow.camera.far = 500 // default
  light.shadow.focus = 1 // default

  return light
}

export function createSpotLightRepr() {
  const geometry = new THREE.SphereGeometry( 1, 6, 6 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0, 0, 10) // set to be the same position of the spotlight
  return sphere
}

export function createCylinder() {
  const cylgeometry = new THREE.CylinderGeometry( 10, 10, 16, 12, 10, true )
  const cylmaterial = new THREE.MeshBasicMaterial( {color: 0x555555, opacity: 0.5, transparent: true, side: THREE.DoubleSide} )
  const cylinder = new THREE.Mesh( cylgeometry, cylmaterial )
  cylinder.rotation.set(-Math.PI/2, 0, 0)
  return cylinder
}

export function addSky(scene) {
  let width = 960
  let length = 670
  const loader = new THREE.TextureLoader()
  const geometry = new THREE.PlaneGeometry( width, length )
  const material = new THREE.MeshPhongMaterial( {map: loader.load(SKY)} )
  const plane = new THREE.Mesh( geometry, material )
  plane.receiveShadow = true
  plane.position.set(150, 150, 20)
  plane.rotation.set(Math.PI / 2, 0, 0)
  scene.add( plane )
}
