import * as THREE from 'three'
import Model from './model'

export default class Arrow extends Model{
  constructor(x, y, z, direction = 0){
    super()
    this.mesh = this.#createMesh(x, y, z, direction)
  }

  #createMesh = (x, y, z, direction) => {
    console.log(x, y, z)
    console.log(direction)
    const radius = 3

    const geometry = new THREE.ConeGeometry(0.7, 0.5, 3)
    const material = new THREE.MeshBasicMaterial({ color: 0x750000 })
    const arrowMesh = new THREE.Mesh(geometry, material)

    const directionVec = new THREE.Vector3(x, y, z)
    const normalVec = new THREE.Vector3(0, 0, 1)
    
    const pivot = new THREE.Object3D()
    arrowMesh.position.set(0, -2, radius)
    pivot.position.set(0, 0, 5)
    x >= 0 ? pivot.rotateY(normalVec.angleTo(directionVec) + THREE.Math.degToRad(direction))
    : pivot.rotateY(-normalVec.angleTo(directionVec) + THREE.Math.degToRad(direction))

    pivot.add(arrowMesh)

    return pivot
  }

  update = () => {
    this.mesh.rotation.y += 0.01 
  }
} 