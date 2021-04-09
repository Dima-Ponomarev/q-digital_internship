import { FETCH_IMAGES } from './actionTypes'


export function fetchImages() {
  return function(dispatch){
    fetch('https://imagesapi.osora.ru/')
      .then(res => res.json())
      .then(data => dispatch({
        type: FETCH_IMAGES,
        payload: data
      }))
  }
}

export default fetchImages