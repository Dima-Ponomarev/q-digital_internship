import Sphere from './modules/sphere.js'
import Arrow from './modules/arrow.js'
import Location from './modules/location.js'
import * as THREE from 'three'

export default class Panorama{
  #renderer
  #scene
  #camera
  #sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  constructor(data, root){
    this.data = data
    this.root = root
    this.loader = new THREE.TextureLoader()
    this.init()
  }

  init = () => {

    this.#scene = new THREE.Scene()
    this.#camera = new THREE.PerspectiveCamera(
      90, 
      this.#sizes.width / this.#sizes.height,
      0.1, 
      1000 
    )
    this.#camera.lookAt(0, 0, 0)
    this.#camera.position.z = 5


    this.#renderer = new THREE.WebGLRenderer({ antialias: true })
    this.#renderer.setSize(this.#sizes.width, this.#sizes.height)
    this.root.appendChild(this.#renderer.domElement)

    const defaultTexture = new THREE.TextureLoader().load('/locations/defaultTexture.png')
    const currentLocation = new Location(this.data[0], this.loader)

    const mainSphere = new Sphere(currentLocation.texture)
    const otherSphere = new Sphere(defaultTexture)
    otherSphere.move(0, 0, -100)

    const arrow = new Arrow()
    arrow.move(0, -2, 0)

    this.#scene.add(mainSphere.mesh)
    this.#scene.add(arrow.mesh)

    const animate = () => {
      requestAnimationFrame(animate)

      this.#renderer.render(this.#scene, this.#camera)
    };

    animate()

    //handle resize
    window.addEventListener('resize', () => {
      this.#sizes.width = window.innerWidth
      this.#sizes.height = window.innerHeight

      this.#camera.aspect = this.#sizes.width / this.#sizes.height
      this.#camera.updateProjectionMatrix()

      this.#renderer.setSize(this.#sizes.width, this.#sizes.height)
    })


  }
}