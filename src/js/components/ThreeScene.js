import * as THREE from 'three'

export default class ThreeScene {
  constructor(root){
    this.root = root
  }

  drawPlane = (scene) => {
    const planeGeometry = new THREE.PlaneGeometry(4.5, 4.5)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x0000ff, 
      side: THREE.DoubleSide 
    })
    const plane = new THREE.Mesh( planeGeometry ,material )
    plane.rotateX( Math.PI - 1 ) 
    plane.rotateZ( Math.PI - 1 )
    scene.add( plane )
  }

  drawSphere = (scene) => {
    const sphereGeometry = new THREE.SphereGeometry( 1, 64, 64 )
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const sphere = new THREE.Mesh( sphereGeometry, material );
    scene.add( sphere );
  }

  init = () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000 
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize( window.innerWidth, window.innerHeight )
    this.root.appendChild( renderer.domElement )

    camera.position.z = 5

    this.drawPlane(scene);
    this.drawSphere(scene)

    renderer.render( scene, camera )
  }



}