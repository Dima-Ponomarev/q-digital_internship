import * as THREE from 'three'

export default class Location {
  constructor(data){
    this.id = data.id
    this.coords = data.coords
    this.description = data.description
    this.siblings = data.siblings
    this.texture = new THREE.TextureLoader().load(data.path)
  }
}