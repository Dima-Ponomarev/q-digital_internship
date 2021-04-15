import * as THREE from 'three'
import Model from './model'

export default class Sphere extends Model{
  constructor(){
    super()
    this.mesh = this.#createMesh()
  }

  #createMesh = () => {
    const arrowShape = new THREE.Shape()
    arrowShape.moveTo(1.5, 0);
    arrowShape.lineTo(0, 0.5);
    arrowShape.lineTo(-1.5, 0);

    const geometry = new THREE.ShapeGeometry(arrowShape)
    const material = new THREE.MeshBasicMaterial({ color: 0x750000 })
    const arrowMesh = new THREE.Mesh(geometry, material)
    
    return arrowMesh
  }
} 