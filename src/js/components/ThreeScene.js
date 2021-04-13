import * as THREE from 'three'

export default class ThreeScene {
  #renderer
  #scene
  #camera

  constructor(root){
    this.root = root
  }

  drawPlane = () => {
    const planeGeometry = new THREE.PlaneGeometry(4.5, 4.5)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x0000ff, 
      side: THREE.DoubleSide 
    })
    const plane = new THREE.Mesh( planeGeometry ,material )
    plane.rotateX( Math.PI - 1.2 ) 
    plane.rotateZ( Math.PI - 1.1 )
    plane.position.set(0, -1, 0)
    this.#scene.add( plane )
  }

  drawSphere = () => {
    const sphereGeometry = new THREE.SphereGeometry( 1, 45, 45 )
    const edges = new THREE.EdgesGeometry( sphereGeometry )

    const material = new THREE.LineBasicMaterial( {
      color: 0x00ff00,
      linewidth: 4,
    } );

    const line = new THREE.LineSegments( edges, material )

    this.#scene.add( line );

    const rotate = () => {
      requestAnimationFrame( rotate )
      line.rotation.y += 0.01
      this.#renderer.render( this.#scene, this.#camera)
    }

    rotate()
  }

  init = () => {
    this.#scene = new THREE.Scene()
    this.#camera = new THREE.PerspectiveCamera( 
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000 
    );

    this.#renderer = new THREE.WebGLRenderer({ antialias: true })
    this.#renderer.setSize( window.innerWidth, window.innerHeight )
    this.root.appendChild( this.#renderer.domElement )

    this.#camera.position.z = 5

    this.drawPlane(this.#scene);
    this.drawSphere(this.#scene)

    this.#renderer.render( this.#scene, this.#camera )
  }



}