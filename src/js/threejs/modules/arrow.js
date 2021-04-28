import * as THREE from 'three'
import Model from './model'

export default class Arrow extends Model{
  constructor(x, y, z, locationId, direction = 0){
    super()
    this.mesh = this.#createMesh(x, y, z, locationId, direction)
  }

  #createMesh = (x, y, z, id, direction) => {
    const radius = 4

    const coneGeometry = new THREE.ConeGeometry(0.7, 0.5, 3)
    const coneMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x750000
    })
    const arrowMesh = new THREE.Mesh(coneGeometry, coneMaterial)

    const boxGeometry = new THREE.BoxGeometry(1.32, 0.2, 0.01)
    const boxMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x5c0000
    })
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)

    const directionVec = new THREE.Vector3(x, y, z)
    const normalVec = new THREE.Vector3(0, 0, 1)
    
    const pivot = new THREE.Object3D()
    arrowMesh.position.set(0, -2, radius)
    boxMesh.position.set(0, -2.56, radius)
    arrowMesh.userData = {type: 'arrow', id: id}
    boxMesh.userData = {type: 'arrow', id: id}
    
    if (x >= 0){
      pivot.rotateY(normalVec.angleTo(directionVec) + THREE.Math.degToRad(direction))
    } else{
      pivot.rotateY(-normalVec.angleTo(directionVec) + THREE.Math.degToRad(direction))
    }

    pivot.rotateX(0.1)

    pivot.add(arrowMesh, boxMesh)

    return pivot
  }
} 