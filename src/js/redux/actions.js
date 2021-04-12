import { FETCH_IMAGES } from './actionTypes'


export function fetchImages(images) {
  return {
    type: FETCH_IMAGES,
    payload: images
  }
}