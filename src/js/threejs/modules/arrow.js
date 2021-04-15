import * as THREE from 'three'
import Model from './model'

export default class Arrow extends Model{
  constructor(x, y, z){
    super()
    this.pivot = this.#createMesh(x, y, z)
  }

  #createMesh = (x, y, z) => {
    const arrowShape = new THREE.Shape()
    arrowShape.moveTo(1.5, 0)
    arrowShape.lineTo(0, 0.5)
    arrowShape.lineTo(-1.5, 0)

    const geometry = new THREE.ShapeGeometry(arrowShape)
    const material = new THREE.MeshBasicMaterial({ color: 0x750000 })
    const arrowMesh = new THREE.Mesh(geometry, material)

    const box = new THREE.Box3().setFromObject( arrowMesh )
    box.getCenter( arrowMesh.position )
    arrowMesh.position.multiplyScalar(-1)

    const pivot = new THREE.Object3D();
    pivot.add(arrowMesh)

    return pivot
  }

  update = () => {
  }
} 