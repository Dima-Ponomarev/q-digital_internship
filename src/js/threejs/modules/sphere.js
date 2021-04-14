import * as THREE from 'three'
import Model from './model'

export default class Sphere extends Model{
  constructor(texture){
    super()
    this.mesh = this.#createMesh(texture)
  }

  #createMesh = (texture) => {
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale( - 1, 1, 1 )

    const material = new THREE.MeshBasicMaterial()
    material.map = texture;

    return new THREE.Mesh(geometry, material)
  }

  changeTexture = (path) => {
    const loader = new THREE.TextureLoader()
    this.mesh.material.map = loader.load(path) 
  }

  setOpacity = (value) => {
    this.mesh.material.opacity = value
  }
  
} 