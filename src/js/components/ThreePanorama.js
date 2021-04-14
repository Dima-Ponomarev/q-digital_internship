import * as THREE from 'three'
import data from './data'

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
       map: loader.load(data[0].path)
    });
    return new THREE.Mesh( geometry, material )
    
  }

  drawArrow = () => {
    const arrowShape = new THREE.Shape()
    arrowShape.moveTo(1.5, 0 );
    arrowShape.lineTo( 0, 0.5 );
    arrowShape.lineTo( -1.5, 0 );
    //arrowShape.lineTo( 1, 0 );

    const geometry = new THREE.ShapeGeometry( arrowShape )
    const material = new THREE.MeshBasicMaterial( { color: 0x750000 } )
    const arrowMesh = new THREE.Mesh( geometry, material )
    arrowMesh.position.y = -2.5
    return arrowMesh
  }

  init = () => {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      90, 
      this.#sizes.width / this.#sizes.height,
      0.1, 
      1000 
    )
    this.camera.target = new THREE.Vector3( 0, 0, 0 )

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize( this.#sizes.width, this.#sizes.height )
    this.root.appendChild( this.renderer.domElement )

    const sphereMesh = this.drawSphere()
    this.scene.add(sphereMesh)
    const arrowMesh = this.drawArrow()

    //this.scene.add(arrowMesh)
    sphereMesh.add(arrowMesh)

    this.camera.position.z = 5
    this.camera.lookAt(0, 0)

    const animate = () => {
      requestAnimationFrame( animate )

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