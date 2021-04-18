import * as THREE from 'three'
import Model from './model'

export default class Arrow extends Model{
  constructor(x, y, z){
    super()
    this.mesh = this.#createMesh(x, y, z)
  }

  #createMesh = (x, y, z) => {
    const radius = 3

    const geometry = new THREE.ConeGeometry(0.7, 0.5, 3)
    const material = new THREE.MeshBasicMaterial({ color: 0x750000 })
    const arrowMesh = new THREE.Mesh(geometry, material)

    // const box = new THREE.Box3().setFromObject( arrowMesh )
    // box.getCenter( arrowMesh.position )
    // arrowMesh.position.multiplyScalar(-1)
    

    const pivot = new THREE.Object3D();
    arrowMesh.position.set(0, -2, radius)
    pivot.position.set(0, 0, 5)
    pivot.rotateY(THREE.Math.degToRad(90) * 1)
    pivot.add(arrowMesh)


    return pivot
  }

  update = () => {
    this.mesh.rotation.y += 0.01 
  }
} 