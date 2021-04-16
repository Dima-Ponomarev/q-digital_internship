import * as THREE from 'three'
import Model from './model'

export default class Arrow extends Model{
  constructor(x, y, z){
    super()
    this.mesh = this.#createMesh(x, y, z)
  }

  #createMesh = (x, y, z) => {
    const arrowShape = new THREE.Shape()
    arrowShape.moveTo(1.5, 0)
    arrowShape.lineTo(0, 0.5)
    arrowShape.lineTo(-1.5, 0)

    const extrudeSettings = {
      steps: 1,
      depth: 1.0,
      bevelEnabled: false
    }

    const geometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings)
    const material = new THREE.MeshBasicMaterial({ color: 0x750000 })
    const arrowMesh = new THREE.Mesh(geometry, material)

    const box = new THREE.Box3().setFromObject( arrowMesh )
    console.log(box)
    console.log(arrowMesh.position)
    box.getCenter( arrowMesh.position )
    console.log(arrowMesh.position)
    console.log(box)
    arrowMesh.position.multiplyScalar(-1)

    const pivot = new THREE.Object3D();
    pivot.add(arrowMesh)

    return pivot
  }

  update = () => {
  }
} 