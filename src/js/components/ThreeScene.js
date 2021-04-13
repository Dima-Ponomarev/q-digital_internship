import * as THREE from 'three'

export default class ThreeScene {
  #renderer
  #scene
  #camera
  #sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  constructor(root){
    this.root = root
    this.init()
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
    plane.position.set(0, -1.3, -1)
    this.#scene.add( plane )
  }

  drawSphere = () => {
    const sphereGeometry = new THREE.SphereGeometry( 1, 40, 40 )
    const edges = new THREE.EdgesGeometry( sphereGeometry )

    const material = new THREE.LineBasicMaterial( {
      color: 0x00ff00,
      linewidth: 4,
    } );

    const line = new THREE.LineSegments( edges, material )
    line.rotateX(0.5)
    line.position.set(0, 0, 1)

    this.#scene.add( line )

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
      this.#sizes.width / this.#sizes.height, 
      0.1, 
      1000 
    )

    this.#renderer = new THREE.WebGLRenderer({ antialias: true })
    this.#renderer.setSize( this.#sizes.width, this.#sizes.height )
    this.root.appendChild( this.#renderer.domElement )

    this.#camera.position.z = 5

    this.drawPlane(this.#scene)
    this.drawSphere(this.#scene)

    this.#renderer.render( this.#scene, this.#camera )

    window.addEventListener('resize', () => {
      this.#sizes.width = window.innerWidth
      this.#sizes.height = window.innerHeight

      this.#camera.aspect = this.#sizes.width / this.#sizes.height
      this.#camera.updateProjectionMatrix()

      this.#renderer.setSize( this.#sizes.width, this.#sizes.height )
    })
  }



}