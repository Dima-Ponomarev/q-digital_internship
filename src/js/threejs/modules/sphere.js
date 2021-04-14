import * as THREE from 'three'

export default class Sphere{
  #opacity
  #sphere

  constructor(path){
    this.mesh = this.#createMesh(path)
  }

  #createMesh = (path) => {
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale( - 1, 1, 1 )

    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial()
    material.map = loader.load(path);

    return new THREE.Mesh( geometry, material )
  }

  move = (x, y, z) => {
    this.mesh.position.set(x, y, z)
  }

  changeTexture = (path) => {
    const loader = new THREE.TextureLoader()
    this.mesh.material.map = loader.load(path) 
  }

  setOpacity = (value) => {
    this.mesh.material.opacity = value
  }
  
} 