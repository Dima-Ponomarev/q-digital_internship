import * as THREE from 'three'
import Model from './model'

export default class Sphere extends Model{
  constructor(texture, radius){
    super()
    this.mesh = this.#createMesh(texture, radius)
  }

  #createMesh = (texture, radius) => {
    const geometry = new THREE.SphereGeometry(radius, 60, 40)
    geometry.scale(- 1, 1, 1)

    const material = new THREE.MeshBasicMaterial()
    material.transparent = true
    material.map = texture
    material.side = THREE.FrontSide

    return new THREE.Mesh(geometry, material)
  }

  changeTexture = (texture) => {
    this.mesh.material.map = texture
  }

  setOpacity = (value) => {
    this.mesh.material.opacity = value
  }
  
} 