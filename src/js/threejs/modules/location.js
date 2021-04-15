export default class Location {
  constructor(data, loader){
    this.data = data
    this.position = data.coords
    this.siblings = data.siblings
    this.#load(loader, data.path)
  }

  #load = (loader, path) => {
    this.texture = loader.load(path)
  }
}