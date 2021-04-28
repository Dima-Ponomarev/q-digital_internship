import Sphere from './modules/sphere.js'
import Arrow from './modules/arrow.js'
import Location from './modules/location.js'
import * as THREE from 'three'

export default class Panorama{
  #renderer
  #scene
  #camera
  #mouse
  #raycaster
  #transitionVec = null
  #sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  #offsetAngle
  #theta = 0
  #phi = 0
  #lat = 0
  #lon = 0
  #isUserInteracting = false
  #mouseMoved = false
  #onMouseDownY = 0
  #onMouseDownX = 0
  #onMouseDownLon = 0 
  #onMouseDownLat = 0
  #mainOpacity = 1 
  #otherOpacity = 0
  #moveFactor = 0.1
  #dragFactor = 0.2    

  constructor(data, root, setCurrentLocationId){
    this.data = data
    this.root = root

    this.loader = new THREE.TextureLoader()
    this.defaultTexture = this.loader.load('/locations/default_texture.png')
    this.isTransitioning = false

    this.currentLocation = new Location(this.data[0], this.loader)
    this.setCurrentLocationId = setCurrentLocationId
    this.setCurrentLocationId(this.currentLocation.id)

    this.locations = [this.currentLocation]
    this.mainSphere = new Sphere(this.currentLocation.texture, 500)
    this.otherSphere = new Sphere(this.defaultTexture, 499)
    this.arrows = []

    this.init()
    this.#loadSiblings(this.currentLocation)
  }

  #getRelativeVector = (x, y, z) => {
    const destination = new THREE.Vector3(x, y, z)

    const {x: cx, y: cy, z: cz} = this.currentLocation.position
    const source = new THREE.Vector3(cx, cy, cz)

    const relativeVector = new THREE.Vector3().subVectors(destination, source)
    const len_vec = Math.sqrt(relativeVector.x ** 2 + relativeVector.y ** 2 + relativeVector.z ** 2);
    return relativeVector.divideScalar(len_vec)
  } 

  renderNextLocation = (id, animation = true) => {

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

    if(animation){

      this.otherSphere.changeTexture(nextLocation.texture)

      //Find out the position where 
      //the next location is placed relative to current
      this.#transitionVec = this.#getRelativeVector(
        nextLocation.position.x,
        nextLocation.position.y,
        nextLocation.position.z
      ).multiplyScalar(500)      

      const normalVectorY = new THREE.Vector3(0, 1, 0)

      this.#transitionVec.applyAxisAngle(normalVectorY, THREE.Math.degToRad(nextLocation.direction || 0))
      
      this.#offsetAngle = (nextLocation.direction || 0) - (this.currentLocation.direction || 0)
      this.mainSphere.mesh.rotateY(THREE.Math.degToRad(this.#offsetAngle))

      this.currentLocation = nextLocation
      this.setCurrentLocationId(this.currentLocation.id)
        
      //Move second sphere to that location and change camera view
      this.#camera.lookAt(this.#transitionVec)

      const radius = (Math.hypot(
        this.#transitionVec.x, 
        this.#transitionVec.y, 
        this.#transitionVec.z
      ))
      this.#phi = Math.acos(this.#transitionVec.y / radius);
      this.#theta = Math.atan2(this.#transitionVec.z, this.#transitionVec.x);
      this.#lon = THREE.Math.radToDeg(this.#theta);
      this.#lat = 90 - THREE.Math.radToDeg(this.#phi);

      this.otherSphere.move(
        this.#transitionVec.x,
        0,
        this.#transitionVec.z
      )

      //start moving second sphere and changing opacity
      this.isTransitioning = true
    } else {
      this.currentLocation = nextLocation
      this.setCurrentLocationId(this.currentLocation.id)
      this.mainSphere.changeTexture(this.currentLocation.texture)
      this.#createArrows()
      this.#loadSiblings(this.currentLocation)
    }
  }

  #loadSiblings = (location) => {
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
        const relativeVec = this.#getRelativeVector(
          location.coords.x,
          location.coords.y,
          location.coords.z
        )
        const newArrow = new Arrow(
          relativeVec.x, 
          relativeVec.y, 
          relativeVec.z,
          location.id,
          this.currentLocation.direction,
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

  #setCameraPosition = () => {
    this.#lat = Math.max(-85, Math.min(85, this.#lat))
  
    this.#phi = THREE.Math.degToRad(90 - this.#lat)
    this.#theta = THREE.Math.degToRad(this.#lon)

    const x = 500 * Math.sin(this.#phi) * Math.cos(this.#theta)
    const y = 500 * Math.cos(this.#phi)
    const z = 500 * Math.sin(this.#phi) * Math.sin(this.#theta)

    this.#camera.lookAt(x, y, z)
  }

  #animate = () => {
    requestAnimationFrame(this.#animate)

    if (this.isTransitioning){
      this.#mainOpacity -= 0.02
      this.#otherOpacity += 0.02
      this.mainSphere.setOpacity(this.#mainOpacity)
      this.otherSphere.setOpacity(this.#otherOpacity)

      if (this.otherSphere.mesh.position.x !== 0 || this.otherSphere.mesh.position.z !== 0){
          this.otherSphere.move(
            this.otherSphere.mesh.position.x - (this.otherSphere.mesh.position.x * this.#moveFactor),
            0,
            this.otherSphere.mesh.position.z - (this.otherSphere.mesh.position.z * this.#moveFactor)
          )
          if (Math.abs(this.otherSphere.mesh.position.x) < 0.3){
            this.otherSphere.mesh.position.x = 0
          }
          if (Math.abs(this.otherSphere.mesh.position.z) < 0.3){
            this.otherSphere.mesh.position.z = 0
          }
      } else{
        this.isTransitioning = false

        this.mainSphere.mesh.rotateY(THREE.Math.degToRad(-this.#offsetAngle))

        this.mainSphere.changeTexture(this.currentLocation.texture)
        this.otherSphere.changeTexture(this.defaultTexture)
        this.otherSphere.move(0, 1000, 0)

        this.#mainOpacity = 1
        this.#otherOpacity = 0
        this.mainSphere.setOpacity(this.#mainOpacity)
        this.otherSphere.setOpacity(this.#otherOpacity)
          
        this.#createArrows()

        this.#loadSiblings(this.currentLocation)
      }

    } else {
      if (this.#isUserInteracting){
        this.#setCameraPosition()
      }
    }

    this.#renderer.render(this.#scene, this.#camera)
  };

  //-----Event handlers-----

  #mouseDownHandler = e => {
    this.#onMouseDownX = e.clientX
    this.#onMouseDownY = e.clientY
    this.#mouseMoved = false
    this.#isUserInteracting = true

    this.#onMouseDownLon = this.#lon
    this.#onMouseDownLat = this.#lat

    document.addEventListener('mousemove', this.#mouseMoveHandler)
    document.addEventListener('mouseup', this.#mouseUpHandler)
  }

  #mouseMoveHandler = e => {
    this.#mouseMoved = true
    this.#lon = ( this.#onMouseDownX - e.clientX) * this.#dragFactor + this.#onMouseDownLon
    this.#lat = (e.clientY - this.#onMouseDownY) * this.#dragFactor + this.#onMouseDownLat
  }

  #mouseUpHandler = () => {
    this.#isUserInteracting = false

    document.removeEventListener('mousemove', this.#mouseMoveHandler)
    document.removeEventListener('mouseup', this.#mouseUpHandler)
  }

  #resizeHandler = () => {
    this.#sizes.width = window.innerWidth
    this.#sizes.height = window.innerHeight

    this.#camera.aspect = this.#sizes.width / this.#sizes.height
    this.#camera.updateProjectionMatrix()

    this.#renderer.setSize(this.#sizes.width, this.#sizes.height)
  }

  #mouseHoverHandler = (e) =>{

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
  
    this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  
  }

  #clickArrowsHandler = () => {
    if (this.#mouseMoved){
      this.#isUserInteracting = false
      return
    }
    this.#raycaster.setFromCamera(this.#mouse, this.#camera)
    const intersects = this.#raycaster.intersectObjects(this.#scene.children, true)
    for(let i = 0; i < intersects.length; i++){
      if (intersects[i].object.userData.type === 'arrow'){
        this.renderNextLocation(intersects[i].object.userData.id)
      }
    }
  }

  init = () => {
    this.#scene = new THREE.Scene()
    this.#camera = new THREE.PerspectiveCamera(
      75, 
      this.#sizes.width / this.#sizes.height,
      0.1, 
      1000 
    )
    this.#camera.lookAt(500, 0, 0)


    this.#renderer = new THREE.WebGLRenderer({ antialias: true })
    this.#renderer.setSize(this.#sizes.width, this.#sizes.height)
    this.root.appendChild(this.#renderer.domElement)

    this.#mouse = new THREE.Vector2()
    this.#raycaster = new THREE.Raycaster()

    this.otherSphere.move(0, 1000, 0)

    this.#scene.add(this.mainSphere.mesh)
    this.#scene.add(this.otherSphere.mesh)
    this.#createArrows()

    this.#animate()

    window.addEventListener('resize', this.#resizeHandler)
    window.addEventListener('click', this.#clickArrowsHandler, false)
    window.addEventListener('mousemove', this.#mouseHoverHandler, false)
    this.root.addEventListener('mousedown', this.#mouseDownHandler, false)
  }
}