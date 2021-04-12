import { SET_LOCAL, SET_FETCHED } from './actionTypes'

export function setLocal(images) {
  return {
    type: SET_LOCAL,
    payload: images
  }
}

export function setFetched(images) {
  return {
    type: SET_FETCHED,
    payload: images
  }
}