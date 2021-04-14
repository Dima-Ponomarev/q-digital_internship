import * as THREE from 'three'
import image from '../../img/locations/pano_1.png'

export default class ThreePanorama{
  renderer
  scene
  camera
  #sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  constructor(root){
    this.root = root
    this.init()
  }

  drawSphere = () => {
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale( - 1, 1, 1 )
    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial({
       map: loader.load(image)
    });
    return new THREE.Mesh( geometry, material )
    
  }

  init = () => {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75, 
      this.#sizes.width / this.#sizes.height,
      0.1, 
      1000 
    )
    this.camera.target = new THREE.Vector3( 0, 0, 0 )

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( this.#sizes.width, this.#sizes.height )
    this.root.appendChild( this.renderer.domElement )

    const sphere = this.drawSphere()
    this.scene.add(sphere)

    this.camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame( animate )

      sphere.rotation.y += 0.001;

      this.renderer.render( this.scene, this.camera )
    };
    this.renderer.render( this.scene, this.camera )

    //Анимация нужна иначе меш с загружаемой текстурой 
    //не показывается (Есть способ лучше?)
    animate()



    //handle resize
    window.addEventListener('resize', () => {
      this.#sizes.width = window.innerWidth
      this.#sizes.height = window.innerHeight

      this.camera.aspect = this.#sizes.width / this.#sizes.height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize( this.#sizes.width, this.#sizes.height )
    })
  }
}