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
    this.defaultTexture = this.loader.load('/locations/default_texture.png')
    this.isTransitioning = false

    this.currentLocation = new Location(this.data[0], this.loader)

    this.locations = [this.currentLocation]
    this.mainSphere = new Sphere(this.currentLocation.texture)
    this.otherSphere = new Sphere(this.defaultTexture)
    this.arrows = []

    this.init()
    this.#loadSiblings(this.currentLocation)
  }

  #renderNextLocation = (id) => {

    this.#deleteArrows()

    //find chosen location by id and load if necessary
    const loadedIdList = this.locations.map(location => location.id)
    let nextLocation

    if (!loadedIdList.includes(id)){
      this.locations.push(new Location(this.data[id], this.loader))
      nextLocation = this.locations[this.locations.length - 1]
    } else {
      nextLocation = this.locations.find(location => location.id === id)
    }

    this.otherSphere.changeTexture(nextLocation.texture)

    //Find out the position where 
    //the next location is placed relative to current
    const {x, y, z} = nextLocation.position
    const destination = new THREE.Vector3(x, y, z)

    const {cx, cy, cz} = this.currentLocation.position
    const source = new THREE.Vector3(cx, cy, cz)

    const positionVec = new THREE.Vector3()
      .subVectors(destination, source)
      .multiplyScalar(1000)
    
    this.currentLocation = nextLocation

    //rotate second sphere to direction angle from data if specified
    //wrong
    if (this.currentLocation.direction){
      const rad = THREE.Math.degToRad(this.currentLocation.direction)
      this.otherSphere.mesh.rotateY(-rad)
    } else {
      this.otherSphere.mesh.rotateY(0)
    }

      
    //Move second sphere to that location and change camera view
    this.#camera.lookAt(positionVec)
    this.otherSphere.move(
      positionVec.x, 
      positionVec.y,
      positionVec.z
    )

    //start moving second sphere and changing opacity
    this.isTransitioning = true
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

    //Create new arrow for each sibling
    this.data.forEach(location => {
      if (this.currentLocation.siblings.includes(location.id)){
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
      this.#scene.add(arrow.mesh)
    })
  }

  #deleteArrows = () => {
    this.arrows.forEach(arrow => {
      this.#scene.remove(arrow.mesh)
    })
    this.arrows = []
  }

  #setCameraPosition = (lat, lon) => {
    lat = Math.max(-85, Math.min(85, lat))
  
    const phi = THREE.Math.degToRad(90 - lat)
    const theta = THREE.Math.degToRad(lon)

    const x = 500 * Math.sin(phi) * Math.cos(theta)
    const y = 500 * Math.cos(phi)
    const z = 500 * Math.sin(phi) * Math.sin(theta)

    this.#camera.lookAt(x, y, z)
  }

  init = () => {
    //variables for mouse events
    let isUserInteracting = false,
      onMouseDownY = 0, onMouseDownX = 0,
      lon = 0, onMouseDownLon = 0,
      lat = 0, onMouseDownLat = 0,
      mainOpacity = 1, otherOpacity = 0

    const moveFactor = 0.1 
    const dragFactor = 0.1    


    this.#scene = new THREE.Scene()
    this.#camera = new THREE.PerspectiveCamera(
      90, 
      this.#sizes.width / this.#sizes.height,
      0.1, 
      1000 
    )
    this.#camera.position.z = 5
    this.#camera.lookAt(500, 0, 0)


    this.#renderer = new THREE.WebGLRenderer({ antialias: true })
    this.#renderer.setSize(this.#sizes.width, this.#sizes.height)
    this.root.appendChild(this.#renderer.domElement)

    this.otherSphere.move(2000, 0, 0)

    this.#scene.add(this.mainSphere.mesh)
    this.#scene.add(this.otherSphere.mesh)
    this.#createArrows()

    setTimeout(() => this.#renderNextLocation(3), 2000)
    //setTimeout(() => this.#renderNextLocation(6), 15000)


    const animate = () => {
      requestAnimationFrame(animate)

      if (this.isTransitioning){
        mainOpacity -= 0.02
        otherOpacity += 0.02
        this.mainSphere.setOpacity(mainOpacity)
        this.otherSphere.setOpacity(otherOpacity)
        if (this.otherSphere.mesh.position.x !== 0 || this.otherSphere.mesh.position.z !== 0){
            this.otherSphere.move(
              this.otherSphere.mesh.position.x - (this.otherSphere.mesh.position.x * moveFactor),
              0,
              this.otherSphere.mesh.position.z - (this.otherSphere.mesh.position.z * moveFactor)
            )
            if (Math.abs(this.otherSphere.mesh.position.x) < 0.2){
              this.otherSphere.mesh.position.x = 0
            }
            if (Math.abs(this.otherSphere.mesh.position.x) < 0.2){
              this.otherSphere.mesh.position.z = 0
            }
        } else{
          this.isTransitioning = false

          this.mainSphere.changeTexture(this.currentLocation.texture)
          this.otherSphere.changeTexture(this.defaultTexture)
          this.otherSphere.move(1000, 0, 0)
          
          mainOpacity = 1
          otherOpacity = 0
          this.mainSphere.setOpacity(mainOpacity)
          this.otherSphere.setOpacity(otherOpacity)
          
          if(this.currentLocation.direction){
            lon = -this.currentLocation.direction
          } else {
            //wrong
            lon = 180
          }
          console.log(this)
          this.#setCameraPosition(lat, lon)
          this.#loadSiblings(this.currentLocation)          
          this.#createArrows()
        }

      } else {
        if (isUserInteracting){
          this.#setCameraPosition(lat, lon)
        }
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