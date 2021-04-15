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
    this.defaultTexture = this.loader.load('/locations/defaultTexture.png')

    this.currentLocation = 0;

    this.locations = [new Location(this.data[this.currentLocation], this.loader)]
    this.mainSphere = new Sphere(this.locations[this.currentLocation].texture)
    this.otherSphere = new Sphere(this.defaultTexture)
    this.arrows = []

    this.init()
    this.#loadSiblings(this.locations[this.currentLocation])
  }

  #loadSiblings = (location) => {
    //List of loaded ids
    const loadedIdList = this.locations.map(location => location.id)

    //load sibling and push to locations array if its not loaded
    location.siblings.forEach(sibling => {
      if (!loadedIdList.includes(sibling)){
        this.locations.push(new Location(this.data[sibling], this.loader))
      }
    })
  }

  #createArrows = () => {
    const current = this.data[this.currentLocation]

    //Create new arrow for each sibling
    this.data.forEach(location => {
      if (current.siblings.includes(location.id)){
        const newArrow = new Arrow(
          location.coords.x, 
          location.coords.y, 
          location.coords.z
        )
        this.arrows.push(newArrow)
      }
    })

    this.#drawArrows()
  }

  #drawArrows = () => {
    this.arrows.forEach(arrow => {
      this.#scene.add(arrow.pivot)
    })
  }

  init = () => {
    //variables for mouse events
    let isUserInteracting = false,
      onMouseDownY = 0, onMouseDownX = 0,
      lon = -90, onMouseDownLon = 0,
      lat = 0, onMouseDownLat = 0
    const dragFactor = 0.15    


    this.#scene = new THREE.Scene()
    this.#camera = new THREE.PerspectiveCamera(
      90, 
      this.#sizes.width / this.#sizes.height,
      0.1, 
      1000 
    )
    this.#camera.position.z = 5


    this.#renderer = new THREE.WebGLRenderer({ antialias: true })
    this.#renderer.setSize(this.#sizes.width, this.#sizes.height)
    this.root.appendChild(this.#renderer.domElement)

    this.otherSphere.move(0, 0, 1000)

    this.#scene.add(this.mainSphere.mesh)
    this.#scene.add(this.otherSphere.mesh)
    this.#createArrows()


    const animate = () => {
      requestAnimationFrame(animate)

      this.arrows[0].update()

      if (isUserInteracting){
        lat = Math.max(-85, Math.min(85, lat))

        const phi = THREE.Math.degToRad(90 - lat)
        const theta = THREE.Math.degToRad(lon)

        const x = 500 * Math.sin(phi) * Math.cos(theta)
        const y = 500 * Math.cos(phi)
        const z = 500 * Math.sin(phi) * Math.sin(theta)

        this.#camera.lookAt(x, y, z)
      }

      this.#renderer.render(this.#scene, this.#camera)
    };

    animate()

    //dragging functions
    const mouseDownHandler = (e) => {
      onMouseDownX = e.clientX
      onMouseDownY = e.clientY
      isUserInteracting = true

      onMouseDownLon = lon
      onMouseDownLat = lat

      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('mouseup', mouseUpHandler)
    }

    const mouseMoveHandler = (e) => {
      lon = ( onMouseDownX - e.clientX) * dragFactor + onMouseDownLon
      lat = (e.clientY - onMouseDownY) * dragFactor + onMouseDownLat
    }

    const mouseUpHandler = (e) => {
      isUserInteracting = false

      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }

    //handle resize
    window.addEventListener('resize', () => {
      this.#sizes.width = window.innerWidth
      this.#sizes.height = window.innerHeight

      this.#camera.aspect = this.#sizes.width / this.#sizes.height
      this.#camera.updateProjectionMatrix()

      this.#renderer.setSize(this.#sizes.width, this.#sizes.height)
    })

    this.root.addEventListener('mousedown', mouseDownHandler)
  }
}