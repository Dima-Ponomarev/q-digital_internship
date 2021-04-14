export default class Model{
  move = (x, y, z) => {
    this.mesh.position.set(x, y, z)
  }
}