import * as THREE from 'three'
import Model from './model'

export default class Sphere extends Model{
  constructor(path){
    super()
    this.mesh = this.#createMesh(path)
  }

  #createMesh = (path) => {
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale( - 1, 1, 1 )

    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial()
    material.map = loader.load(path);

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